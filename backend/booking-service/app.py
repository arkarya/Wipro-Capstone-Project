from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
import requests
from model import db, Bookings
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS

app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False

app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

db.init_app(app)
api = Api(app)

GATEWAY_URL = 'http://gateway:5000/api'

class BookPackage(Resource):
    def post(self):
        booking = request.get_json()
        pkg_details = requests.get(f"{GATEWAY_URL}/packages/{booking['package_id']}")
        
        if pkg_details.status_code == 404:
            return {'message' : "Package doesn't exists."}, 404
        
        pkg_details = pkg_details.json()
        available_slots = pkg_details['available_slots']
        post_slots = available_slots - booking['total_adults'] - booking['total_children']
        if post_slots < 0:
            return {'message' : f'Only {available_slots} are available'}, 409
        
        new_booking = Bookings(
            user_id = booking['user_id'] or None,
            package_id = booking['package_id'],
            name = booking['name'],
            email = booking['email'],
            phone = booking['phone'],
            total_adults = booking['total_adults'],
            total_children = booking['total_children'],
            start_date = booking['start_date'],
            amt_paid = booking['amt_paid']
        )

        db.session.add(new_booking)

        post_slots = requests.put(f"{GATEWAY_URL}/packages/{pkg_details['id']}", json = {'available_seats' : post_slots})
        if post_slots.status_code != 200:
            db.session.rollback()
            return {'message' : 'Booking Unsuccessful'},500

        db.session.commit()
        return {'message' : 'Booking Confirmed'}, 201

class BookingDetails(Resource):
    def get(self,id):
        booking = Bookings.query.get(id)
        if not booking:
            return {'message' : 'Booking Not Found'}, 404
        return booking.to_dict(), 200
    
    def put(self, id):
        data = request.get_json()
        booking = Bookings.query.get(id)
        if not booking:
            return {'message' : "Booking Doesn't exist"}, 404
        
        for field in ['name', 'email', 'phone', 'total_adults', 'total_children']:
            if field in data:
                setattr(booking, field, data[field])

        db.session.commit()
        return {'message' : 'Booking Updated'}, 200
            
    def delete(self, id):
        booking = Bookings.query.get(id)
        print
        if not booking:
            return {'message' : "Booking Doesn't exist"}, 404
        
        db.session.delete(booking)
        db.session.commit()
        return {'message' : 'Booking Canceled'}, 200


class BookingHistory(Resource):
    def get(self,id):
        booking_history = Bookings.query.filter_by(user_id = id).all()
        if not booking_history:
            return {'message' : 'No bookings yet'}, 404
        
        return ([booking.to_dict() for booking in booking_history]), 200

api.add_resource(BookPackage, '/bookings')
api.add_resource(BookingDetails, '/bookings/<id>')
api.add_resource(BookingHistory, '/bookings/users/<id>')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    CORS(app, resources={r"/*": {"origins": "http://localhost:80"}})  
    app.run(host='0.0.0.0',port=5001,debug=True)
    