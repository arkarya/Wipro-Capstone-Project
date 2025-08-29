from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False

BOOKING_SERVICE_URL = 'http://booking:5001/bookings'
PACKAGE_SERVICE_URL = 'http://package:5002/packages'
USER_SERVICE_URL = 'http://user:5003/users'

@app.route('/api/packages', methods=['GET', 'POST'])
def package():
    if request.method == 'POST':
        response = requests.post(f"{PACKAGE_SERVICE_URL}/", json = request.json)
    else:
        response = requests.get(f"{PACKAGE_SERVICE_URL}/")

    return jsonify(response.json()), response.status_code

@app.route('/api/packages/<id>', methods=['GET', 'PUT', 'DELETE'])
def package_details(id):
    if request.method == 'PUT':
        response = requests.put(f"{PACKAGE_SERVICE_URL}/{id}", json = request.json)
    elif request.method == 'DELETE':
        response = requests.delete(f"{PACKAGE_SERVICE_URL}/{id}")
    else:
        response = requests.get(f"{PACKAGE_SERVICE_URL}/{id}")
    return jsonify(response.json()), response.status_code

@app.route('/api/packages/<q>')
def package_by_type(q):
        response = requests.get(f"{PACKAGE_SERVICE_URL}/{q}")
        return jsonify(response.json()), response.status_code

@app.route('/api/bookings', methods=['POST'])
def booking():
    if request.method == 'POST':
        response = requests.post(f"{BOOKING_SERVICE_URL}/", json = request.json)

    return jsonify(response.json()), response.status_code

@app.route('/api/bookings/<id>', methods=['GET', 'PUT', 'DELETE'])
def booking_details(id):
    if request.method == 'PUT':
        response = requests.put(f"{BOOKING_SERVICE_URL}/{id}", json = request.json)
    elif request.method == 'DELETE':
        response = requests.delete(f"{BOOKING_SERVICE_URL}/{id}")
    else:
        response = requests.get(f"{BOOKING_SERVICE_URL}/{id}")

    return jsonify(response.json()), response.status_code

@app.route('/api/bookings/users/<id>')
def booking_history(id):
    response = requests.get(f"{BOOKING_SERVICE_URL}/users/{id}")
    return jsonify(response.json()), response.status_code

@app.route('/api/register', methods=['POST'])
def user():
    response = requests.post(f"{USER_SERVICE_URL}/", json = request.json)
    return jsonify(response.json()), response.status_code

@app.route('/api/login', methods=['POST'])
def login():
    response = requests.post(f"{USER_SERVICE_URL}/login", json = request.json)
    return jsonify(response.json()), response.status_code

@app.route('/api/logout', methods=['PUT'])
def logout():
    response = requests.put(f"{USER_SERVICE_URL}/logout", json = request.json)
    return jsonify(response.json()), response.status_code

@app.route('/api/users/<id>', methods=['GET', 'PUT', 'DELETE'])
def user_details(id):
    if request.method == 'PUT':
        response = requests.put(f"{USER_SERVICE_URL}/{id}", json = request.json)
    elif request.method == 'DELETE':
        response = requests.delete(f"{USER_SERVICE_URL}/{id}")
    else:
        response = requests.get(f"{USER_SERVICE_URL}/{id}")

    return jsonify(response.json()), response.status_code



if __name__ == '__main__':
    CORS(app, resources={r"/*": {"origins": "http://localhost:80"}})
    app.run(host='0.0.0.0', port=5000 ,debug=True)