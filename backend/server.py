from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from the root .env file (parent directory)
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(env_path)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB Connection
mongo_uri = os.getenv('MONGODB_URI')
client = MongoClient(mongo_uri)
db = client.get_database('artisanflow') # the URI defaults to this, but good to be explicit
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

        # Insert into MongoDB
        result = users_collection.insert_one(data)
        
        # Convert ObjectId to string for response
        data['_id'] = str(result.inserted_id)
        
        return jsonify({"message": "User registered successfully", "user": data}), 201

    except Exception as e:
        print(f"Error in register: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
