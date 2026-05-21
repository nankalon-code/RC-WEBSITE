"""
seed_admin.py — Run once to seed the admin account.
Usage: python seed_admin.py
"""
import os
from dotenv import load_dotenv
load_dotenv()

from database import engine, Base, SessionLocal
import models
from auth import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

email = os.environ.get("ADMIN_EMAIL", "admin@robotics.club")
password = os.environ.get("ADMIN_PASSWORD", "admin123")
name = os.environ.get("ADMIN_NAME", "Admin")

existing = db.query(models.User).filter(models.User.email == email).first()
if existing:
    print(f"Admin '{email}' already exists.")
else:
    admin = models.User(
        email=email,
        hashed_password=hash_password(password),
        name=name,
        role="admin",
    )
    db.add(admin)
    db.commit()
    print(f"Admin '{email}' created successfully.")

db.close()
