from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth, firestore
from get_best_tasks import find_best_tasks

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


@app.route('/')
def home():
    return jsonify({"message": "Flask is running!"})

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    task_ref = db.collection('tasks').document()
    task_ref.set({
        'title': data['title'],
        'status': 'pending',
        'body': data['body'],
        'date': data['date'],
        'category': data['category'],
        'elderID': data['elderID'],
        'latitude': data['latitude'],
        'longitude': data['longitude'],
        'volunteerID': None
    })
    return jsonify({'id': task_ref.id, 'message': 'Task added successfully!'}), 201

@app.route('/tasks/<email>', methods=['GET'])
def get_tasks(email):
    user_doc = db.collection('users').document(email)
    if not user_doc:
        return jsonify({'error': 'User not found'}), 404
    user_data = user_doc.get().to_dict()
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
    db.collection('tasks').document.where('email','==', email)
    return jsonify({'message': 'User updated successfully!'})

@app.route('/users/<email>', methods=['DELETE'])
def delete_user(email):
    db.collection('tasks').document(email).where('email','==',email).delete()
    return jsonify({'message': 'User deleted successfully!'})

@app.route('/debug')
def debug_routes():
    return jsonify([str(rule) for rule in app.url_map.iter_rules()])

if __name__ == '__main__':
    app.run(debug=True)
