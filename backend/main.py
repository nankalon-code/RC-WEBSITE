import os
import logging
from datetime import datetime, date
from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRouter
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session

import models, schemas
from database import engine, get_db, Base
from auth import (
    hash_password, verify_password,
    create_access_token, create_refresh_token,
    set_refresh_cookie, clear_refresh_cookie,
    get_current_user, get_current_user_from_refresh,
    require_admin, require_member,
)
from email_service import (
    send_registration_email, send_announcement_email, send_contact_email,
    send_welcome_user_email, send_member_promotion_email
)
from seed_data import SEED_IDEAS

from pathlib import Path
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)

# ── Rate limiter ───────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Robotics Club API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ───────────────────────────────────────────────────────
_origins_env = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
ALLOWED_ORIGINS = [o.strip() for o in _origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Versioned router ───────────────────────────────────────────
api = APIRouter(prefix="/api/v1")


# ─────────────────────────────────────────────────────────────
#  STARTUP SEED
# ─────────────────────────────────────────────────────────────

@app.on_event("startup")
def seed_db():
    db = next(get_db())

    # Admin Seeding / Syncing from Environment Variables
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@robotics.club")
    admin_pass = os.environ.get("ADMIN_PASSWORD", "admin123")
    admin_name = os.environ.get("ADMIN_NAME", "Admin")

    existing_admin = db.query(models.User).filter(models.User.email == admin_email).first()
    if existing_admin:
        existing_admin.hashed_password = hash_password(admin_pass)
        existing_admin.name = admin_name
        existing_admin.role = "admin"
        db.commit()
        logger.info(f"Synchronized and updated admin: {admin_email}")
    else:
        db.add(models.User(
            email=admin_email,
            hashed_password=hash_password(admin_pass),
            name=admin_name,
            role="admin",
        ))
        db.commit()
        logger.info(f"Seeded new admin: {admin_email}")


    # Ideas
    if db.query(models.Idea).count() == 0:
        for idea_data in SEED_IDEAS:
            db.add(models.Idea(**idea_data))
        db.commit()
        logger.info("Seeded 50 ideas.")

    # Site content
    if db.query(models.SiteContent).count() == 0:
        defaults = [
            ("faculty_name", "Dr. Faculty Name"),
            ("faculty_title", "Faculty Coordinator"),
            ("faculty_bio", "Leading research in robotics and autonomous systems."),
            ("faculty_photo", "https://i.pravatar.cc/150?u=faculty"),
            ("about_text", "The Robotics Club is an advanced engineering hub dedicated to solving real-world challenges through intelligent automation."),
            ("about_text_2", "We provide resources, mentorship, and environment to bring your vision to life."),
            ("stat_projects", "24+"),
            ("stat_members", "150"),
            ("stat_stacks", "6"),
            ("stat_wins", "5"),
            ("contact_email", "roboticsclub.rtukota@gmail.com"),
            ("club_github", "https://github.com/robotics-club"),
            ("club_linkedin", ""),
            ("club_instagram", ""),
        ]
        for k, v in defaults:
            db.add(models.SiteContent(key=k, value=v))
        db.commit()

    # Self-healing migration for contact email setting
    existing_contact = db.query(models.SiteContent).filter(models.SiteContent.key == "contact_email").first()
    if existing_contact and existing_contact.value == "robotics@club.edu":
        existing_contact.value = "roboticsclub.rtukota@gmail.com"
        db.commit()

    # Display members
    if db.query(models.DisplayMember).count() == 0:
        placeholders = [
            ("Alex Chen", "Club President", 1),
            ("Priya Sharma", "Hardware Lead", 2),
            ("Marcus Williams", "Software Lead", 3),
            ("Aisha Patel", "IoT Lead", 4),
            ("Jordan Kim", "Operations", 5),
        ]
        for name, role, order in placeholders:
            db.add(models.DisplayMember(
                name=name, role=role, order=order,
                photo_url=f"https://i.pravatar.cc/200?u={name.replace(' ','')}"
            ))
        db.commit()

    # Sample events
    if db.query(models.Event).count() == 0:
        db.add(models.Event(title="Robotics Workshop", date="2026-06-15", type="Workshop", description="Hands-on session covering ROS2 and sensor integration."))
        db.add(models.Event(title="Annual Hackathon", date="2026-07-10", type="Hackathon", description="48-hour build sprint — bring your best ideas."))
        db.add(models.Event(title="Project Showcase", date="2026-08-01", type="Showcase", description="Present your semester project to faculty and industry guests."))
        db.commit()

    # Sample resources
    if db.query(models.Resource).count() == 0:
        db.add(models.Resource(title="ROS2 Getting Started Guide", tag="PDF Guide", link="https://docs.ros.org/en/humble/index.html", description="Official ROS2 documentation for beginners."))
        db.add(models.Resource(title="Club GitHub Organization", tag="GitHub Repository", link="https://github.com/robotics-club", description="All club project repositories and templates."))
        db.add(models.Resource(title="Arduino & Sensor Reference", tag="PDF Guide", link="https://www.arduino.cc/reference/en/", description="Arduino language reference and sensor examples."))
        db.commit()

    # Sample announcement
    if db.query(models.Announcement).count() == 0:
        db.add(models.Announcement(title="Platform Launch", message="The Robotics Club platform is now live. Register your team on the Forum!", type="General", target="all"))
        db.commit()

    db.close()


# ─────────────────────────────────────────────────────────────
#  HEALTH
# ─────────────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


# ─────────────────────────────────────────────────────────────
#  AUTH
# ─────────────────────────────────────────────────────────────

@api.post("/auth/register", response_model=schemas.Token)
@limiter.limit("5/minute")
def register(request: Request, response: Response, data: schemas.UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        email=data.email,
        hashed_password=hash_password(data.password),
        name=data.name,
        role="user",
        github_url=data.github_url,
        student_id=data.student_id,
        phone=data.phone,
    )
    db.add(user); db.commit(); db.refresh(user)
    
    # Auto-link any pending team memberships to this new user
    db.query(models.TeamMemberLink).filter(models.TeamMemberLink.member_email == user.email).update({
        models.TeamMemberLink.user_id: user.id
    })
    db.commit()
    
    background_tasks.add_task(send_welcome_user_email, user.email, user.name)
    
    token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh = create_refresh_token({"sub": str(user.id), "role": user.role})
    set_refresh_cookie(response, refresh)
    return {"access_token": token, "token_type": "bearer", "user": user}


@api.post("/auth/login", response_model=schemas.Token)
@limiter.limit("5/minute")
def login(request: Request, response: Response, data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account deactivated. Contact admin.")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh = create_refresh_token({"sub": str(user.id), "role": user.role})
    set_refresh_cookie(response, refresh)
    return {"access_token": token, "token_type": "bearer", "user": user}


@api.post("/auth/refresh", response_model=schemas.Token)
def refresh_token(response: Response, user: models.User = Depends(get_current_user_from_refresh)):
    token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh = create_refresh_token({"sub": str(user.id), "role": user.role})
    set_refresh_cookie(response, refresh)
    return {"access_token": token, "token_type": "bearer", "user": user}


@api.post("/auth/logout")
def logout(response: Response):
    clear_refresh_cookie(response)
    return {"status": "ok"}


@api.get("/auth/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@api.post("/auth/create-member", response_model=schemas.UserOut)
def create_member(data: schemas.CreateMemberRequest, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    if db.query(models.User).filter(models.User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        email=data.email,
        hashed_password=hash_password(data.password),
        name=data.name,
        role="member",
        student_id=data.student_id,
        phone=data.phone,
    )
    db.add(user); db.commit(); db.refresh(user)
    return user


# ─────────────────────────────────────────────────────────────
#  ADMIN: USER MANAGEMENT
# ─────────────────────────────────────────────────────────────

@api.get("/admin/users", response_model=list[schemas.UserOut])
def list_users(db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    return db.query(models.User).all()


@api.put("/admin/users/{user_id}/role")
def update_user_role(user_id: int, role: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    if role not in ("admin", "member", "user"):
        raise HTTPException(status_code=400, detail="Invalid role")
    if role == "admin" and admin.id != 1:
        raise HTTPException(status_code=403, detail="Only the primary admin can grant admin access.")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    old_role = user.role
    user.role = role
    db.commit()
    if role == "member" and old_role != "member":
        background_tasks.add_task(send_member_promotion_email, user.email, user.name)
    return {"status": "ok", "user_id": user_id, "new_role": role}


@api.put("/admin/users/{user_id}/toggle-active")
def toggle_user_active(user_id: int, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"status": "ok", "is_active": user.is_active}


# ─────────────────────────────────────────────────────────────
#  IDEAS
# ─────────────────────────────────────────────────────────────

@api.get("/ideas", response_model=list[schemas.IdeaOut])
def get_ideas(db: Session = Depends(get_db)):
    return db.query(models.Idea).all()


@api.post("/ideas", response_model=schemas.IdeaOut)
def create_idea(data: schemas.IdeaCreate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    idea = models.Idea(**data.model_dump())
    db.add(idea); db.commit(); db.refresh(idea)
    return idea


@api.put("/ideas/{idea_id}", response_model=schemas.IdeaOut)
def update_idea(idea_id: int, data: schemas.IdeaCreate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    idea = db.query(models.Idea).filter(models.Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    for k, v in data.model_dump().items():
        setattr(idea, k, v)
    db.commit(); db.refresh(idea)
    return idea


@api.put("/ideas/{idea_id}/unlock")
def unlock_idea(idea_id: int, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    idea = db.query(models.Idea).filter(models.Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    idea.status = "available"
    idea.locked_by_team = None
    reg = db.query(models.TeamRegistration).filter(models.TeamRegistration.idea_id == idea_id).first()
    if reg:
        db.query(models.TeamMemberLink).filter(models.TeamMemberLink.team_id == reg.id).delete()
        db.delete(reg)
    db.commit()
    return {"status": "ok", "message": "Idea unlocked successfully"}


@api.delete("/ideas/{idea_id}")
def delete_idea(idea_id: int, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    idea = db.query(models.Idea).filter(models.Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    reg = db.query(models.TeamRegistration).filter(models.TeamRegistration.idea_id == idea_id).first()
    if reg:
        db.query(models.TeamMemberLink).filter(models.TeamMemberLink.team_id == reg.id).delete()
        db.delete(reg)
    db.delete(idea); db.commit()
    return {"status": "ok"}


# ─────────────────────────────────────────────────────────────
#  TEAM REGISTRATION
# ─────────────────────────────────────────────────────────────

@api.post("/register-team", response_model=schemas.IdeaOut)
def register_team(req: schemas.TeamRegisterRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    idea = db.query(models.Idea).filter(models.Idea.id == req.idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Project idea not found")
    if idea.status == "locked":
        raise HTTPException(status_code=400, detail="This idea is already locked by another team.")
    if len(req.members) < 2 or len(req.members) > 4:
        raise HTTPException(status_code=400, detail="Team must have 2 to 4 members.")

    idea.status = "locked"
    idea.locked_by_team = req.team_name

    registration = models.TeamRegistration(team_name=req.team_name, idea_id=idea.id)
    db.add(registration); db.flush()

    member_emails = []
    for m in req.members:
        user = db.query(models.User).filter(models.User.email == m.email).first()
        db.add(models.TeamMemberLink(
            team_id=registration.id,
            user_id=user.id if user else None,
            member_email=m.email,
            member_name=m.name or (user.name if user else m.email.split("@")[0]),
            member_roll_number=m.student_id or (user.student_id if user else None),
            member_branch=m.branch,
            member_github=m.github or (user.github_url if user else None),
            member_linkedin=m.linkedin,
        ))
        member_emails.append(m.email)

    db.add(models.Announcement(
        title="Team Registered",
        message=f"Team '{req.team_name}' locked project: {idea.title}",
        type="Alert", target="all",
    ))
    db.commit(); db.refresh(idea)

    background_tasks.add_task(
        send_registration_email, member_emails, registration.id, req.team_name, idea.title, idea.description
    )
    return idea


@api.get("/teams", response_model=list[schemas.TeamRegistrationOut])
def get_teams(db: Session = Depends(get_db)):
    return db.query(models.TeamRegistration).all()


@api.put("/teams/{team_id}/progress")
def update_progress(team_id: int, data: schemas.TeamProgressUpdate, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    team = db.query(models.TeamRegistration).filter(models.TeamRegistration.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Ownership Check: Only team members or admins can update progress
    if user.role != "admin":
        is_member = db.query(models.TeamMemberLink).filter(
            models.TeamMemberLink.team_id == team.id,
            (models.TeamMemberLink.user_id == user.id) | (models.TeamMemberLink.member_email == user.email)
        ).first()
        if not is_member:
            raise HTTPException(status_code=403, detail="You do not have permission to update this team's progress.")
    if data.progress is not None:
        team.progress = data.progress
    if data.progress_description is not None:
        team.progress_description = data.progress_description
    if data.github_repo is not None:
        team.github_repo = data.github_repo
    db.commit()
    return {"status": "ok"}


# ─────────────────────────────────────────────────────────────
#  ATTENDANCE
# ─────────────────────────────────────────────────────────────

@api.post("/attendance", response_model=schemas.AttendanceOut)
def mark_attendance(data: schemas.AttendanceCreate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    record = models.Attendance(**data.model_dump())
    db.add(record); db.commit(); db.refresh(record)
    return record


@api.post("/attendance/checkin", response_model=schemas.AttendanceOut)
def self_checkin(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    today = date.today().isoformat()
    existing = db.query(models.Attendance).filter(
        models.Attendance.user_id == user.id,
        models.Attendance.date == today,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already checked in today.")
    record = models.Attendance(user_id=user.id, date=today, event_name="Self Check-in")
    db.add(record); db.commit(); db.refresh(record)
    return record


@api.get("/attendance/{user_id}", response_model=list[schemas.AttendanceOut])
def get_attendance(user_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    if user.role != "admin" and user.id != user_id:
        raise HTTPException(status_code=403, detail="You can only view your own attendance records.")
    return db.query(models.Attendance).filter(models.Attendance.user_id == user_id).all()


# ─────────────────────────────────────────────────────────────
#  ANNOUNCEMENTS
# ─────────────────────────────────────────────────────────────

@api.get("/announcements", response_model=list[schemas.AnnouncementOut])
def get_announcements(db: Session = Depends(get_db)):
    return db.query(models.Announcement).order_by(models.Announcement.timestamp.desc()).all()


@api.post("/announcements", response_model=schemas.AnnouncementOut)
def create_announcement(data: schemas.AnnouncementCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    ann = models.Announcement(**data.model_dump())
    db.add(ann); db.commit(); db.refresh(ann)
    # Email blast based on target
    q = db.query(models.User)
    if data.target == "members":
        q = q.filter(models.User.role.in_(["member", "admin"]))
    elif data.target == "users":
        q = q.filter(models.User.role == "user")
    emails = [u.email for u in q.all()]
    if emails:
        background_tasks.add_task(send_announcement_email, emails, data.title, data.message)
    return ann


# ─────────────────────────────────────────────────────────────
#  CONTACT FORM
# ─────────────────────────────────────────────────────────────

@api.post("/contact")
@limiter.limit("3/minute")
def contact_form(request: Request, data: schemas.ContactForm, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db.add(models.ContactMessage(**data.model_dump()))
    db.commit()
    background_tasks.add_task(send_contact_email, data.name, data.email, data.subject, data.message)
    return {"status": "ok", "message": "Your message has been received."}


# ─────────────────────────────────────────────────────────────
#  ACHIEVEMENTS
# ─────────────────────────────────────────────────────────────

@api.get("/achievements", response_model=list[schemas.AchievementOut])
def get_achievements(db: Session = Depends(get_db)):
    return db.query(models.Achievement).all()


@api.post("/achievements", response_model=schemas.AchievementOut)
def create_achievement(data: schemas.AchievementCreate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    a = models.Achievement(**data.model_dump())
    db.add(a); db.commit(); db.refresh(a)
    return a


@api.delete("/achievements/{aid}")
def delete_achievement(aid: int, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    db.query(models.Achievement).filter(models.Achievement.id == aid).delete()
    db.commit()
    return {"status": "ok"}


# ─────────────────────────────────────────────────────────────
#  SITE CONTENT
# ─────────────────────────────────────────────────────────────

@api.get("/site-content")
def get_site_content(db: Session = Depends(get_db)):
    return {item.key: item.value for item in db.query(models.SiteContent).all()}


@api.put("/site-content")
def update_site_content(data: schemas.SiteContentUpdate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    item = db.query(models.SiteContent).filter(models.SiteContent.key == data.key).first()
    if item:
        item.value = data.value
    else:
        db.add(models.SiteContent(key=data.key, value=data.value))
    db.commit()
    return {"status": "ok"}


# ─────────────────────────────────────────────────────────────
#  DISPLAY MEMBERS
# ─────────────────────────────────────────────────────────────

@api.get("/display-members", response_model=list[schemas.DisplayMemberOut])
def get_display_members(db: Session = Depends(get_db)):
    return db.query(models.DisplayMember).order_by(models.DisplayMember.order).all()


@api.post("/display-members", response_model=schemas.DisplayMemberOut)
def create_display_member(data: schemas.DisplayMemberCreate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    m = models.DisplayMember(**data.model_dump())
    db.add(m); db.commit(); db.refresh(m)
    return m


@api.put("/display-members/{mid}", response_model=schemas.DisplayMemberOut)
def update_display_member(mid: int, data: schemas.DisplayMemberCreate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    m = db.query(models.DisplayMember).filter(models.DisplayMember.id == mid).first()
    if not m:
        raise HTTPException(status_code=404, detail="Member not found")
    for k, v in data.model_dump().items():
        setattr(m, k, v)
    db.commit(); db.refresh(m)
    return m


@api.delete("/display-members/{mid}")
def delete_display_member(mid: int, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    db.query(models.DisplayMember).filter(models.DisplayMember.id == mid).delete()
    db.commit()
    return {"status": "ok"}


# ─────────────────────────────────────────────────────────────
#  EVENTS
# ─────────────────────────────────────────────────────────────

@api.get("/events", response_model=list[schemas.EventOut])
def get_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()


@api.post("/events", response_model=schemas.EventOut)
def create_event(data: schemas.EventCreate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    e = models.Event(**data.model_dump())
    db.add(e); db.commit(); db.refresh(e)
    return e


@api.delete("/events/{eid}")
def delete_event(eid: int, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    db.query(models.Event).filter(models.Event.id == eid).delete()
    db.commit()
    return {"status": "ok"}


# ─────────────────────────────────────────────────────────────
#  RESOURCES
# ─────────────────────────────────────────────────────────────

@api.get("/resources", response_model=list[schemas.ResourceOut])
def get_resources(db: Session = Depends(get_db)):
    return db.query(models.Resource).all()


@api.post("/resources", response_model=schemas.ResourceOut)
def create_resource(data: schemas.ResourceCreate, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    r = models.Resource(**data.model_dump())
    db.add(r); db.commit(); db.refresh(r)
    return r


@api.delete("/resources/{rid}")
def delete_resource(rid: int, db: Session = Depends(get_db), admin: models.User = Depends(require_admin)):
    db.query(models.Resource).filter(models.Resource.id == rid).delete()
    db.commit()
    return {"status": "ok"}


# ─────────────────────────────────────────────────────────────
#  MOUNT ROUTER
# ─────────────────────────────────────────────────────────────

app.include_router(api)
