from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ─────────────────────────────────────────
#  Auth
# ─────────────────────────────────────────

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    github_url: Optional[str] = None
    student_id: Optional[str] = None
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    role: str
    github_url: Optional[str] = None
    avatar_url: Optional[str] = None
    student_id: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class CreateMemberRequest(BaseModel):
    name: str
    email: str
    password: str
    student_id: Optional[str] = None
    phone: Optional[str] = None


# ─────────────────────────────────────────
#  Ideas
# ─────────────────────────────────────────

class IdeaBase(BaseModel):
    title: str
    category: str
    difficulty: str
    description: str
    tech_stack: Optional[str] = None
    learning_outcomes: Optional[str] = None
    resume_tags: Optional[str] = None


class IdeaCreate(IdeaBase):
    deadline: Optional[str] = None


class IdeaOut(IdeaBase):
    id: int
    status: str
    locked_by_team: Optional[str] = None
    deadline: Optional[str] = None

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
#  Team Registration
# ─────────────────────────────────────────

class TeamMember(BaseModel):
    name: str
    email: str
    student_id: Optional[str] = None
    branch: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None


class TeamRegisterRequest(BaseModel):
    team_name: str
    members: List[TeamMember]           # structured, 2-4 members
    idea_id: int


class TeamProgressUpdate(BaseModel):
    progress: Optional[float] = None
    progress_description: Optional[str] = None
    github_repo: Optional[str] = None


class TeamMemberLinkOut(BaseModel):
    id: int
    member_email: str
    member_name: Optional[str] = None
    member_roll_number: Optional[str] = None
    member_branch: Optional[str] = None
    member_github: Optional[str] = None
    member_linkedin: Optional[str] = None

    class Config:
        from_attributes = True


class TeamRegistrationOut(BaseModel):
    id: int
    team_name: str
    idea_id: int
    github_repo: Optional[str] = None
    progress: float
    progress_description: Optional[str] = None
    registered_at: datetime
    members: List[TeamMemberLinkOut] = []

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
#  Attendance
# ─────────────────────────────────────────

class AttendanceCreate(BaseModel):
    user_id: int
    date: str
    event_name: Optional[str] = None


class AttendanceOut(BaseModel):
    id: int
    user_id: int
    date: str
    event_name: Optional[str] = None

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
#  Announcements
# ─────────────────────────────────────────

class AnnouncementCreate(BaseModel):
    title: str
    message: str
    type: str = "General"
    target: str = "all"                 # all | members | users


class AnnouncementOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    target: str
    timestamp: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
#  Achievements
# ─────────────────────────────────────────

class AchievementCreate(BaseModel):
    title: str
    description: Optional[str] = None
    date: Optional[str] = None
    category: Optional[str] = None


class AchievementOut(AchievementCreate):
    id: int

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
#  Site Content
# ─────────────────────────────────────────

class SiteContentUpdate(BaseModel):
    key: str
    value: str


# ─────────────────────────────────────────
#  Display Members (Meet the Team)
# ─────────────────────────────────────────

class DisplayMemberCreate(BaseModel):
    name: str
    role: str
    photo_url: Optional[str] = None
    order: int = 0


class DisplayMemberOut(DisplayMemberCreate):
    id: int

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
#  Events
# ─────────────────────────────────────────

class EventCreate(BaseModel):
    title: str
    date: str
    type: Optional[str] = None
    description: Optional[str] = None


class EventOut(EventCreate):
    id: int

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
#  Resources
# ─────────────────────────────────────────

class ResourceCreate(BaseModel):
    title: str
    tag: Optional[str] = None
    link: Optional[str] = None
    description: Optional[str] = None


class ResourceOut(ResourceCreate):
    id: int

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
#  Contact Form
# ─────────────────────────────────────────

class ContactForm(BaseModel):
    name: str
    email: str
    subject: str
    message: str
