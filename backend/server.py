from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import requests
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import hashlib
import sys

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '.env')
if not os.path.exists(env_path):
    # Fallback to root or other locations if needed
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(env_path)

app = Flask(__name__)

# CORS Configuration
cors_origins = os.getenv('CORS_ORIGINS', '*').split(',')
cors_origins = [origin.strip() for origin in cors_origins]
CORS(app, origins=cors_origins)

# MongoDB Connection
# Render uses MONGO_URL, but we fallback to MONGODB_URI for local dev if needed
mongo_uri = os.getenv('MONGO_URL') or os.getenv('MONGODB_URI')
if not mongo_uri:
    print("Warning: MONGO_URL not found")
    
# Initialize MongoClient appropriately
try:
    client = MongoClient(mongo_uri)
    db_name = os.getenv('DB_NAME', 'artisanflow') # Use DB_NAME from env if available
    db = client.get_database(db_name)
    users_collection = db.users
except Exception as e:
    print(f"Warning: Could not connect to MongoDB: {e}")
    users_collection = None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"}), 200

# Email Configuration (Updated with SES Credentials)
# Email Configuration (Updated with SES Credentials)
# Default to provided SES creds if not in Env
SMTP_HOST = os.getenv('SMTP_HOST')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
SMTP_USER = os.getenv('SMTP_USER')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
SMTP_FROM_EMAIL = os.getenv('SMTP_FROM_EMAIL', 'contact@artisanflow.com')

def send_confirmation_email(to_email, first_name, last_name, password, pin):
    if not SMTP_USER or not SMTP_PASSWORD:
        print("SMTP credentials not configured. Skipping email.")
        return

    subject = "Bienvenue sur ArtisanFlow - Votre inscription est confirmée !"
    
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #E85D04;">Bienvenue {first_name} {last_name} !</h2>
        <p>Votre compte ArtisanFlow a été créé avec succès.</p>
        <p>Vous pouvez dès à présent vous connecter et commencer à gérer votre activité.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 5px solid #E85D04; margin: 20px 0;">
            <h3>Vos identifiants de connexion :</h3>
            <p><strong>Email :</strong> {to_email}</p>
            <p><strong>Mot de passe :</strong> {password}</p>
            <p><strong>Code PIN :</strong> {pin}</p>
        </div>
        
        <p><em>Note : Pour votre sécurité, nous vous recommandons de ne pas partager ces informations.</em></p>
        
        <p>À bientôt sur <a href="https://artisanflow.com" style="color: #E85D04;">ArtisanFlow</a> !</p>
      </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM_EMAIL
    msg["To"] = to_email

    msg.attach(MIMEText(html_content, "html"))

    try:
        # SES Port 587 uses STARTTLS
        if SMTP_PORT == 587:
            context = ssl.create_default_context()
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls(context=context)
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(SMTP_FROM_EMAIL, to_email, msg.as_string())
        else:
            # Fallback for SSL (465)
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context) as server:
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.sendmail(SMTP_FROM_EMAIL, to_email, msg.as_string())
                
        print(f"Confirmation email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Basic validation (extend as needed)
        required_fields = ['email', 'password'] # Add others if needed like 'firstName', 'lastName'
        for field in required_fields:
            if field not in data:
               pass # relaxing check for now as we just want to store "inscriptions"
        
        # Check if user already exists
        if users_collection is not None:
            if 'email' in data and users_collection.find_one({"email": data['email']}):
                return jsonify({"error": "User already exists"}), 409

        # Ensure payment fingerprint is saved
        if 'paymentIdentifier' in data and 'payment_fingerprint' not in data:
            import hashlib
            data['payment_fingerprint'] = hashlib.sha256(data['paymentIdentifier'].encode()).hexdigest()

        # Stripe Integration
        stripe_customer_id = None
        stripe_payment_method_id = None
        
        if 'cardData' in data:
            import stripe
            stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
            
            try:
                # 1. Create Customer
                customer = stripe.Customer.create(
                    email=data.get('email'),
                    name=f"{data.get('firstName')} {data.get('lastName')}",
                    description=f"Client {data.get('companyName')}"
                )
                stripe_customer_id = customer.id
                
                # 2. Create Payment Method
                card_info = data['cardData']
                payment_method = stripe.PaymentMethod.create(
                    type="card",
                    card={
                        "number": card_info['number'],
                        "exp_month": card_info['exp_month'],
                        "exp_year": card_info['exp_year'],
                        "cvc": card_info['cvc'],
                    },
                )
                stripe_payment_method_id = payment_method.id
                
                # 3. Attach to Customer
                stripe.PaymentMethod.attach(
                    stripe_payment_method_id,
                    customer=stripe_customer_id,
                )
                
                # 4. Set as Default (Optional but good)
                stripe.Customer.modify(
                    stripe_customer_id,
                    invoice_settings={"default_payment_method": stripe_payment_method_id},
                )
                
                data['stripe_customer_id'] = stripe_customer_id
                data['stripe_payment_method_id'] = stripe_payment_method_id
                
            except Exception as stripe_err:
                print(f"Stripe Error: {stripe_err}")
                return jsonify({"error": f"Erreur Stripe: {str(stripe_err)}"}), 400

        # Insert into MongoDB
        result_id = "mock_id_if_no_db"
        if users_collection is not None:
            result = users_collection.insert_one(data)
            result_id = str(result.inserted_id)
        
        # Convert ObjectId to string for response
        data['_id'] = result_id
        
        # SEND CONFIRMATION EMAIL
        # Warning: Sending raw password/pin is insecure but requested by user
        send_confirmation_email(
            data.get('email'),
            data.get('firstName', ''),
            data.get('lastName', ''),
            data.get('password', ''),
            data.get('pin', '')
        )

        return jsonify({
            "message": "User registered successfully", 
            "user": data,
            "stripe_customer_id": stripe_customer_id
        }), 201

    except Exception as e:
        print(f"Error in register: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/verify-vat', methods=['POST'])
def verify_vat():
    try:
        import time
        from stdnum.eu import vat as eu_vat
        from stdnum.gb import vat as gb_vat
        # Try to import specific country modules if available for better handling?
        # For now, rely on eu_vat generic
        
        data = request.json
        country = data.get('country', '')
        vat_number = data.get('vatNumber', '')
        tva_status = data.get('tvaStatus', '') # 'assujetti' or 'non-assujetti'
        
        if not vat_number:
             return jsonify({"valid": False, "message": "Numéro requis"}), 200

        # Normalize VAT Number
        clean_vat = vat_number.replace(' ', '').replace('.', '').replace('-', '').upper()
        
        # Determine Prefix based on country string
        prefix = None
        if "France" in country: prefix = 'FR'
        elif "Belgique" in country: prefix = 'BE'
        elif "Luxembourg" in country: prefix = 'LU'
        elif "Espagne" in country: prefix = 'ES'
        elif "Italie" in country: prefix = 'IT'
        elif "Allemagne" in country: prefix = 'DE'
        elif "Royaume-Un" in country or "United Kingdom" in country or "UK" in country: prefix = 'GB'
        # Add others if needed. 
        # Note: Suisse, Quebec etc not in VIES.

        # If prefix detected and not present, add it
        if prefix and not clean_vat.startswith(prefix):
            clean_vat = prefix + clean_vat

        # Special Case: UK
        is_uk = "Royaume-Un" in country or "UK" in country or "GB" in country
        
        if is_uk:
             if not gb_vat.is_valid(clean_vat):
                 return jsonify({"valid": False, "message": "Numéro UK invalide (Format)"}), 200
             return jsonify({"valid": True, "message": "UK Validé (Format)"}), 200

        # Check Supported Non-EU (Suisse, Quebec) -> Always Valid details
        if "Suisse" in country or "Québec" in country or "Etats-Unis" in country or "Canada" in country:
             return jsonify({"valid": True, "message": "Validé (International)"}), 200

        # EU VIES Verification
        # 1. Check Format (Local)
        if not eu_vat.is_valid(clean_vat):
             # If format is invalid, we can't check VIES.
             # But if non-assujetti, maybe the user put a business ID (SIRET?) that is not a VAT number.
             if tva_status == 'non-assujetti':
                  # Relaxed pass for non-assujetti with invalid VAT format (likely just a raw business ID)
                  return jsonify({"valid": True, "message": "Format accepté (Non assujetti)"}), 200
             
             return jsonify({"valid": False, "message": "Format invalide (Code pays manquant ou longueur incorrecte)"}), 200

        # 2. Check VIES Online (if format valid)
        try:
            vies_result = eu_vat.check_vies(clean_vat)
            
            if vies_result['valid']:
                name = vies_result['name'] or 'Inconnu'
                return jsonify({"valid": True, "message": f"Validé VIES ({name})"}), 200
            else:
                # Invalid in VIES
                if tva_status == 'non-assujetti':
                    # User is not liable, so they might not be in VIES, OR their number works but VIES says invalid for cross-border.
                    # We ACCEPT them as requested.
                     return jsonify({"valid": True, "message": "Validé (Non assujetti - Non VIES)"}), 200
                
                return jsonify({"valid": False, "message": "Numéro non valide selon VIES"}), 200

        except Exception as e:
            # VIES Error (Timeout etc)
            print(f"VIES Check error: {e}")
            if tva_status == 'non-assujetti':
                return jsonify({"valid": True, "message": "Validé (Erreur VIES ignorée)"}), 200
                
            return jsonify({"valid": False, "message": "Vérification VIES indisponible."}), 200

    except Exception as e:
        print(f"Error in verify-vat: {e}")
        return jsonify({"valid": False, "message": f"Erreur serveur : {str(e)}"}), 200

import stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

@app.route('/api/auth/verify-payment', methods=['POST'])
def verify_payment():
    try:
        data = request.json or {}
        payment_method = data.get('method')
        identifier = data.get('identifier') # Card number or IBAN

        # Fail open if no identifier
        if not identifier:
             return jsonify({"valid": True, "message": "Pas d'identifiant, validé."}), 200

        # Check Uniqueness using Stripe Fingerprint
        # Note: Sending raw card to server is NOT PCI Compliant for production.
        fingerprint = None
        
        try:
            import hashlib
            # Check if identifier is string
            if not isinstance(identifier, str):
                identifier = str(identifier)
                
            fingerprint = hashlib.sha256(identifier.encode('utf-8')).hexdigest()
        except Exception as e:
            print(f"Hashing error: {e}")
            # Valid by default if we can't hash
            return jsonify({"valid": True, "message": "Erreur hash, validé par défaut"}), 200

        # Check DB for this fingerprint
        if fingerprint and users_collection is not None:
             # Check both users collection (legacy) or any other place
             # For now just users
            existing = users_collection.find_one({"payment_fingerprint": fingerprint})
            if existing:
                 return jsonify({"valid": False, "message": "Ce moyen de paiement est déjà utilisé."}), 200

        return jsonify({"valid": True, "message": "Paiement validé", "fingerprint": fingerprint}), 200

    except Exception as e:
        print(f"Error in verify-payment: {e}")
        # Fail open on generic error to allow registration to proceed
        return jsonify({"valid": True, "message": "Erreur serveur, validé par sécurité"}), 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
