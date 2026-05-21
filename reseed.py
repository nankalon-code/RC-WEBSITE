import os
from database import SessionLocal, engine
import models
from seed_data import SEED_IDEAS

def reseed():
    db = SessionLocal()
    try:
        print("Connected to database. Surgically dropping and recreating the 'ideas' table...")
        # Drop the table surgically if it exists
        models.Idea.__table__.drop(bind=engine, checkfirst=True)
        # Recreate the table with the latest schema columns
        models.Idea.__table__.create(bind=engine, checkfirst=True)
        print(f"Table 'ideas' recreated. Seeding {len(SEED_IDEAS)} new ideas...")
        
        # Add new 50 curated CV-ready ideas
        for idea_data in SEED_IDEAS:
            db.add(models.Idea(**idea_data))
            
        db.commit()
        print("Database reseeded successfully with 50 CV-ready projects!")
    except Exception as e:
        db.rollback()
        print(f"Error during reseeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    reseed()
