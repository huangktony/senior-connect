from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()

@app.route('/api/save-user', methods=['GET', 'POST', 'OPTIONS'])
def save_user():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
        
    try:
        print("📥 Received save-user request")
        
        if request.method == 'GET':
            return jsonify({'message': 'Use POST to save user'}), 200
        
        data = request.json
        print(f"📝 Data received: {data}")
        
        email = data.get('email')
        
        if not email:
            print("❌ No email provided")
            return jsonify({'error': 'Email is required'}), 400
        
        print(f"💾 Saving to Firestore...")
        db.collection('users').document(email).set(data, merge=True)
        
        print(f"✅ User {email} saved to Firestore")
        return jsonify({'success': True, 'message': 'User saved successfully'}), 200
        
    except Exception as e:
        print(f"❌ Error saving user: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)