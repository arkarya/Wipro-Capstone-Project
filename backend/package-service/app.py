from flask import Flask, request
from flask_cors import CORS
from flask_restful import Resource, Api
import requests
from sqlalchemy import or_
from model import db, Packages
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS

app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
db.init_app(app)
api = Api(app)

GATEWAY_URL = 'http://gateway:5000/api'

class Package(Resource):
    def get(self):
        packages = Packages.query.all()
        if not packages:
            return { 'message' : 'No packages available at the moment'}, 404
        
        return ([package.to_dict() for package in packages]), 200

    def post(self):
        package = request.get_json()
        user_id = package['user_id']
        if not user_id:
            return { 'message' : 'You have to login'}, 400

        response = requests.get(f"{GATEWAY_URL}/users/{user_id}")
        user_data = response.json()

        
        if user_data.get('role') != 'admin':
            return {'message': 'Unauthorized'}, 401
        
        new_package = Packages(
            name = package['name'],
            type = package['type'],
            destination = package['destination'],
            country = package['country'],
            price = package['price'],
            duration_days = package['duration_days'],
            start_date = package['start_date'],
            description = package['description'],
            total_slots = package['total_slots'],
            available_slots = package['available_slots'],
            image_url1 = package['image_url1'],
            image_url2 = package['image_url2'],
            image_url3 = package['image_url3']
        )
        db.session.add(new_package)
        db.session.commit()
        return {'message' : 'Package added successfully'}, 201

class PackageDetails(Resource):
    def get(self,id):
        package = Packages.query.filter_by(id = id).first()
        if not package:
            return {'message' : 'Package Not Found'}, 404
        
        return package.to_dict(), 200
    
    def put(self, id):
        data = request.get_json()
        package = Packages.query.filter_by(id = id).first()
        if not package:
            return {'message' : "Package Doesn't exist"}, 404
        
        for field in ['name', 'type', 'destination', 'country','price', 'duration_days', 'start_date', 'description', 
                      'total_slots', 'available_slots', 'image_url1', 'image_url2', 'image_url3' ]:
            if field in data:
                setattr(package, field, data[field])

        db.session.commit()
        return {'message' : 'Package Updated'}, 200
            
    def delete(self, id):
        package = Packages.query.filter_by(id = id).first()
        if not package:
            return {'message' : "Package Doesn't exist"}, 404
        
        db.session.delete(package)
        db.session.commit()
        return {'message' : 'Package removed'}, 200

class PackageType(Resource):
    def get(self,q):
        packages = Packages.query.filter(
    or_(
        Packages.name.ilike(f'%{q}%'),
        Packages.type.ilike(f'%{q}%'),
        Packages.destination.ilike(f'%{q}%'),
        Packages.country.ilike(f'%{q}%')
    )
).all()

        if not packages:
            return {'meassage' : 'No such package type available'}, 404
        
        return ([package.to_dict() for package in packages]), 200

api.add_resource(Package, '/packages')
api.add_resource(PackageDetails, '/packages/<id>')
api.add_resource(PackageType, '/packages/<q>')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    CORS(app, resources={r"/*": {"origins": "http://localhost:80"}})
    app.run(host='0.0.0.0',port=5002,debug=True)