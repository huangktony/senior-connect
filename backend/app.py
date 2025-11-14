from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
import firebase_admin
from firebase_admin import credentials, auth, firestore
from get_best_tasks import find_best_tasks
from google.genai import Client
import os
import datetime

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)
CORS(app, resources={r"/*": {"origins": "*"}})

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/')
def home():
    return jsonify({"message": "Flask is running!"})


@app.route('/chat', methods=['POST'])
def chat_create_task_gemini():
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    # Accept JSON with transcript and user info
    data = request.get_json()
    transcript = data.get('transcript', '')
    elderID = data.get('elderID', '')
    latitude = data.get('latitude', 0)
    longitude = data.get('longitude', 0)

    if not transcript.strip():
        return jsonify({'error': 'No transcript provided'}), 400

    # 1. Use Google genai SDK to extract task fields
    import re, json as pyjson
    client = Client(api_key=GEMINI_API_KEY)

    gemini_prompt = (
        "You are an assistant that extracts task details from user instructions. "
        "Given the following text, extract the following fields as JSON: "
        "title, status, body, date (in JavaScript date string format), category, elderID, latitude, longitude, volunteerID. "
        "If a field is not mentioned, use an empty string or null. "
        f"If the user refernces today or tomorrow, the date is \"{datetime.datetime.now()}\". Remember to put the right time based on the user's request"
        f"User said: \"{transcript}\""
    )
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=gemini_prompt
            )
        print(response)
        # The response.text should contain the JSON
        match = re.search(r'({.*})', response.text, re.DOTALL)
        task_fields = pyjson.loads(match.group(1)) if match else {}
    except Exception as e:
        return jsonify({'error': f'Gemini parsing failed: {str(e)}', 'gemini_raw': getattr(response, 'text', str(response))}), 500

    # 2. Fill in missing fields from request if not present
    if not task_fields.get('elderID'):
        task_fields['elderID'] = elderID
    if not task_fields.get('latitude'):
        task_fields['latitude'] = latitude
    if not task_fields.get('longitude'):
        task_fields['longitude'] = longitude

    # 3. Create the Firestore task
    task_ref = db.collection('tasks').document()
    task_ref.set({
        'title': task_fields.get('title', ''),
        'status': 'pending',
        'body': task_fields.get('body', ''),
        'date': task_fields.get('date', ''),
        'category': task_fields.get('category', ''),
        'elderID': task_fields.get('elderID', ''),
        'latitude': task_fields.get('latitude', 0),
        'longitude': task_fields.get('longitude', 0),
        'volunteerID': task_fields.get('volunteerID', None)
    })
    return jsonify({'id': task_ref.id, 'message': f'Task \"{task_fields.get('title', '')}\" created!', 'fields': task_fields}), 201

@app.route('/tasks/<email>', methods=['GET'])
def get_tasks(email):
    user_doc = db.collection('users').document(email)
    if not user_doc:
        return jsonify({'error': 'User not found'}), 404
    user_data = user_doc.get().to_dict()
    if not user_data:
        return jsonify({"error": f"No user found with email {email}"}), 404
    role = user_data.get('role', 'elder')
    if role == 'volunteer':
        tasks_ref = db.collection('tasks')
    else:
        tasks_ref = db.collection('tasks').where('elderID', '==', email)
    docs = tasks_ref.stream()
    tasks = [{**doc.to_dict(), 'id': doc.id} for doc in docs]
    if role == 'volunteer':
        tasks = find_best_tasks(tasks, user_data)
    return jsonify(tasks)


@app.route('/tasks/<task_id>', methods=['PATCH'])
def update_task(task_id):
    data = request.get_json()
    db.collection('tasks').document(task_id).update(data)
    return jsonify({'message': 'Task updated successfully!'})


@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    db.collection('tasks').document(task_id).delete()
    return jsonify({'message': 'Task deleted successfully!'})
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    task_ref = db.collection('tasks').document()
    task_ref.set({
        'title': data['title'],
        'status': 'pending',
        'body': data['body'],
        'date': data['date'],
        'time': data['time'],
        'category': data['category'],
        'elderID': data['elderID'],
        'latitude': data['latitude'],
        'longitude': data['longitude'],
        'volunteerID': None
    })
    return jsonify({'id': task_ref.id, 'message': 'Task added successfully!'}), 201


@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    task_ref = db.collection('users').document()
    task_ref.set({
        'first-name': data['first-name'],
        'last-name': data['last-name'],
        'latitude': data['latitude'],
        'longitude': data['longitude'],
        'skills': data['skills'],
        'type': data['type'],
        'distance': data['distance'],
        'email': data['email']
    })
    return jsonify({'id': task_ref.id, 'message': 'User added successfully!'}), 201


@app.route('/users/<email>', methods=['GET'])
def get_user(email):
    doc_ref = db.collection('users').document(email)
    doc = doc_ref.get()
    if not doc.exists:
        return jsonify({'error': 'User not found'}), 404
    user_data = doc.to_dict()
    user_data['id'] = doc.id
    return jsonify(user_data), 200


@app.route('/users/<email>', methods=['PATCH'])
def update_user(email):
    data = request.get_json()
    user_ref = db.collection('users').document(email)
    user_ref.update({
        'firstName': data.get('firstName'),
        'lastName': data.get('lastName'),
        'latitude': data.get('latitude'),
        'longitude': data.get('longitude')
    })
    return jsonify({'message': 'User updated successfully!'})


@app.route('/users/<email>', methods=['DELETE'])
def delete_user(email):
    db.collection('tasks').document(email).where('email', '==', email).delete()
    return jsonify({'message': 'User deleted successfully!'})
@app.route('/debug')
def debug_routes():
    return jsonify([str(rule) for rule in app.url_map.iter_rules()])


if __name__ == '__main__':
    app.run(debug=True)
