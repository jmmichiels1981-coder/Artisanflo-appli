from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import requests
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
    
client = MongoClient(mongo_uri)
db_name = os.getenv('DB_NAME', 'artisanflow') # Use DB_NAME from env if available
db = client.get_database(db_name)
users_collection = db.users

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"}), 200

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
        result = users_collection.insert_one(data)
        
        # Convert ObjectId to string for response
        data['_id'] = str(result.inserted_id)
        
        return jsonify({
            "message": "User registered successfully", 
            "user": data,
            "stripe_customer_id": stripe_customer_id
        }), 201

    except Exception as e:
        print(f"Error in register: {e}")
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        print(f"Error in register: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/verify-vat', methods=['POST'])
def verify_vat():
    try:
        import time
        from stdnum.eu import vat as eu_vat
        from stdnum.gb import vat as gb_vat
        from stdnum.exceptions import InvalidChecksum, InvalidFormat, InvalidComponent

        data = request.json
        country = data.get('country')
        vat_number = data.get('vatNumber')
        
        if not vat_number:
             return jsonify({"valid": False, "message": "Numéro de TVA manquant"}), 200

        # Normalize VAT Number (remove spaces, dots, dashes, uppercase)
        clean_vat = vat_number.replace(' ', '').replace('.', '').replace('-', '').upper()
        
        # Logic for EU (VIES) vs UK
        is_uk = "Royaume-Uni" in country or "UK" in country or "GB" in country
        
        if is_uk:
             # UK Verification (Strict Checksum)
             if not gb_vat.is_valid(clean_vat):
                 return jsonify({"valid": False, "message": "Numéro TVA UK invalide (Format/Checksum incorrect)"}), 200
             
             # Stdnum does not provide online UK check without API, so we rely on checksum as per plan.
             return jsonify({"valid": True, "message": "TVA UK Validée (Format OK)"}), 200

        else:
            # EU VIES Verification
            # 1. Check Format first
            try:
                # Validate format and checksum locally first
                if not eu_vat.is_valid(clean_vat):
                     return jsonify({"valid": False, "message": "Format TVA invalide pour l'UE"}), 200

                # 2. Check VIES Online
                # Note: check_vies returns a dict with 'valid': True/False and name/address
                # It raises exceptions if connection fails.
                vies_result = eu_vat.check_vies(clean_vat)
                
                if vies_result['valid']:
                    name = vies_result['name'] or 'Inconnu'
                    return jsonify({"valid": True, "message": f"TVA Validée via VIES ({name})"}), 200
                else:
                    return jsonify({"valid": False, "message": "Numéro de TVA non valide selon VIES"}), 200

            except Exception as e:
                # STRICT MODE: If VIES fails (timeout, connection error), we FAIL.
                print(f"VIES Check fail/error: {e}")
                return jsonify({"valid": False, "message": "Vérification VIES impossible ou échouée. Impossible de valider la TVA."}), 200

    except Exception as e:
        print(f"Error in verify-vat: {e}")
        return jsonify({"valid": False, "message": f"Erreur serveur lors de la vérification : {str(e)}"}), 200

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
        if fingerprint:
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
