from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

class Bookings(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer)
    package_id = db.Column(db.Integer, nullable = False)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    total_adults = db.Column(db.Integer, nullable = False)
    total_children = db.Column(db.Integer, default=0)
    start_date = db.Column(db.Date, nullable = False)
    status = db.Column(db.String(20), default='Pending')
    amt_paid = db.Column(db.Float, nullable = False)
    booked_at = db.Column(db.DateTime, default = datetime.now(timezone.utc))
   

    def to_dict(self):
        return {
            'id': self.id,
            'package_id' : self.package_id,
            'name' : self.name,
            'email' : self.email,
            'phone' : self.phone,
            'total_adults': self.total_adults,
            'total_children': self.total_children,
            'start_date' : self.start_date.isoformat(),
            'status' : self.status,
            'amt_paid': self.amt_paid,
        }
