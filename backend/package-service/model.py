from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Packages(db.Model):
    __tablename__ = 'packages'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    destination = db.Column(db.String(150), nullable=False)
    country = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    duration_days = db.Column(db.Integer, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text, nullable=False)
    total_slots = db.Column(db.Integer, nullable=False)
    available_slots = db.Column(db.Integer, nullable=False)
    image_url1 = db.Column(db.String(300), nullable=False)
    image_url2 = db.Column(db.String(300))
    image_url3 = db.Column(db.String(300))
    created_at = db.Column(db.DateTime, default = datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'name' : self.name,
            'type' : self.type,
            'destination' : self.destination,
            'country' : self.country,
            'price': self.price,
            'duration_days' : self.duration_days,
            'start_date' : self.start_date.isoformat(),
            'description' : self.description,
            'total_slots' : self.total_slots,
            'available_slots' : self.available_slots,
            'image_url1' : self.image_url1,
            'image_url2' : self.image_url2,
            'image_url3' : self.image_url3
        }
