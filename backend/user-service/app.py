from flask import Flask, request
from flask_cors import CORS
from flask_restful import Resource, Api
import requests
from model import db, Users
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS

app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
db.init_app(app)
api = Api(app)

class User(Resource):
    def post(self):
        user = request.get_json()
        if Users.query.filter_by(email = user['email']).first():
            return {'message' : 'Email already registered'}, 400

        new_user = Users(
            name = user['name'],
            email = user['email'],
            phone = user['phone'],
            password = user['password']
        )
        db.session.add(new_user)
        db.session.commit()
        return {'message' : 'Registration successful'}, 201

class UserDetails(Resource):
    def get(self,id):
        user = Users.query.filter_by(id = id).first()
        if not user:
            return {'message' : 'User Not Found'}, 404
        
        return user.to_dict(), 200
    
    def put(self, id):
        data = request.get_json()
        user = Users.query.filter_by(id = id).first()
        if not user:
            return {'message' : "User Doesn't exist"}, 404
        
        for field in ['name', 'email', 'phone', 'password', 'logged']:
            if field in data:
                setattr(user, field, data[field])

        db.session.commit()
        return {'message' : 'User Updated'}, 200
            
    def delete(self, id):
        user = Users.query.filter_by(id = id).first()
        if not user:
            return {'message' : "User Doesn't exist"}, 404
        
        db.session.delete(user)
        db.session.commit()
        return {'message' : 'User deleted'}, 200

class Login(Resource):
    def post(self):
        login_details = request.get_json()
        user = Users.query.filter(Users.email == login_details['email'] and Users.password == login_details['password']).first()
        if user is None:
            return {'message' : 'Invalid login credentials'}, 401
        
        user.logged = True
        db.session.commit()
        
        return {'message' : 'Login Successful', 'id' : user.id, 'name' : user.name, 'logged' : True, 'role' : user.role}, 200

class Logout(Resource):
    def put(self):
        logout = request.get_json()
        user = Users.query.filter_by(id = logout['id']).first()

        user.logged = False
        db.session.commit()
        return { 'message' : 'Logged out'}, 200

api.add_resource(User, '/users')
api.add_resource(UserDetails, '/users/<int:id>')
api.add_resource(Login, '/users/login')
api.add_resource(Logout, '/users/logout')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    CORS(app, resources={r"/*": {"origins": "http://localhost:80"}})
    app.run(host='0.0.0.0',port=5003,debug=True)