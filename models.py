from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="user")          # admin | member | user
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    position = Column(String, default="Core Member", nullable=True)
    avatar_url = Column(String, nullable=True)
    student_id = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    attendance_records = relationship("Attendance", back_populates="user")
    team_memberships = relationship("TeamMemberLink", back_populates="user")


class Idea(Base):
    __tablename__ = "ideas"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    category = Column(String, nullable=False)      # Hardware | Software | IoT
    difficulty = Column(String, nullable=False)    # Beginner | Intermediate | Advanced
    description = Column(Text, nullable=False)
    tech_stack = Column(String, nullable=True)
    learning_outcomes = Column(Text, nullable=True)
    resume_tags = Column(String, nullable=True)    # comma-separated tags
    status = Column(String, default="available", index=True)   # available | locked
    locked_by_team = Column(String, nullable=True)
    deadline = Column(String, nullable=True)

    registration = relationship("TeamRegistration", back_populates="idea", uselist=False)


class TeamRegistration(Base):
    __tablename__ = "team_registrations"

    id = Column(Integer, primary_key=True, index=True)
    team_name = Column(String, nullable=False, unique=True)
    idea_id = Column(Integer, ForeignKey("ideas.id"), nullable=False, unique=True)
    github_repo = Column(String, nullable=True)
    progress = Column(Float, default=0.0)
    progress_description = Column(Text, nullable=True)
    registered_at = Column(DateTime, default=datetime.datetime.utcnow)

    idea = relationship("Idea", back_populates="registration")
    members = relationship("TeamMemberLink", back_populates="team")


class TeamMemberLink(Base):
    __tablename__ = "team_member_links"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("team_registrations.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    member_email = Column(String, nullable=False)
    member_name = Column(String, nullable=True)
    member_roll_number = Column(String, nullable=True)
    member_branch = Column(String, nullable=True)
    member_github = Column(String, nullable=True)
    member_linkedin = Column(String, nullable=True)

    team = relationship("TeamRegistration", back_populates="members")
    user = relationship("User", back_populates="team_memberships")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    date = Column(String, nullable=False)
    event_name = Column(String, nullable=True)

    user = relationship("User", back_populates="attendance_records")


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="General")       # General | Alert | Event
    target = Column(String, default="all")         # all | members | users
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    project_name = Column(String, nullable=True)
    award_place = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    date = Column(String, nullable=True)
    category = Column(String, nullable=True)


class GalleryItem(Base):
    __tablename__ = "gallery_items"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, nullable=False)
    caption = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)


class SiteContent(Base):
    __tablename__ = "site_content"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, nullable=False)
    value = Column(Text, nullable=False)


class DisplayMember(Base):
    __tablename__ = "display_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    photo_url = Column(String, nullable=True)
    order = Column(Integer, default=0)


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    date = Column(String, nullable=False)
    type = Column(String, nullable=True)
    description = Column(Text, nullable=True)


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    tag = Column(String, nullable=True)
    link = Column(String, nullable=True)
    description = Column(Text, nullable=True)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    received_at = Column(DateTime, default=datetime.datetime.utcnow)
