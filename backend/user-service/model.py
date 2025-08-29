from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(50))
    phone = db.Column(db.String(10), nullable=False)
    password = db.Column(db.String(50), nullable = False)
    logged = db.Column(db.Boolean, default=False)
    role = db.Column(db.String(10), default='user')
    created_at = db.Column(db.DateTime, default = datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'name' : self.name,
            'email' : self.email,
            'phone' : self.phone,
            'role' : self.role
        }
