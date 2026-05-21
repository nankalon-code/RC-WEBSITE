import smtplib
import os
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

SMTP_EMAIL = os.environ.get("SMTP_EMAIL", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
CLUB_EMAIL = os.environ.get("ADMIN_EMAIL", "robotics@club.edu")


def send_email(to_emails: list[str], subject: str, body_html: str):
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        logger.info(f"[EMAIL MOCK] TO: {', '.join(to_emails)} | SUBJECT: {subject}")
        return
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SMTP_EMAIL
        msg["To"] = ", ".join(to_emails)
        msg.attach(MIMEText(body_html, "html"))
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_emails, msg.as_string())
        logger.info(f"[EMAIL SENT] {subject} → {', '.join(to_emails)}")
    except Exception as e:
        logger.error(f"[EMAIL FAILED] {e}")


def send_registration_email(to_emails: list[str], team_name: str, idea_title: str, deadline: str, idea_desc: str = ""):
    subject = f"Robotics Club — Team '{team_name}' Registration Confirmed"
    body = f"""
    <div style="font-family:sans-serif;padding:32px;background:#0a0a0f;color:#e0e0e0;max-width:600px;margin:auto;border-radius:12px;">
      <div style="border-bottom:1px solid #222;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="color:#00d4ff;font-size:24px;margin:0;">Registration Confirmed</h1>
      </div>
      <p>Congratulations, <strong style="color:#fff;">{team_name}</strong>!</p>
      <p>Your team has successfully registered for the following project:</p>
      <div style="background:#111;border:1px solid #222;border-radius:8px;padding:20px;margin:20px 0;">
        <h2 style="color:#fff;margin:0 0 8px;">{idea_title}</h2>
        <p style="color:#888;font-size:14px;margin:0;">{idea_desc[:200]}{"..." if len(idea_desc) > 200 else ""}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr><td style="color:#888;padding:8px 0;border-bottom:1px solid #1a1a1a;">Deadline</td>
            <td style="color:#fff;padding:8px 0;border-bottom:1px solid #1a1a1a;text-align:right;"><strong>{deadline}</strong></td></tr>
      </table>
      <div style="background:#0d1a1f;border:1px solid #00d4ff22;border-radius:8px;padding:20px;margin-bottom:24px;">
        <h3 style="color:#00d4ff;margin:0 0 12px;font-size:16px;">GitHub Submission Requirements</h3>
        <ul style="color:#aaa;font-size:14px;margin:0;padding-left:20px;line-height:1.8;">
          <li>Create a public GitHub repository for your project</li>
          <li>Submit the repo URL in your User Dashboard before the deadline</li>
          <li>Include a <code style="background:#111;padding:2px 6px;border-radius:4px;">README.md</code> with setup instructions</li>
          <li>Tag your final submission commit as <code style="background:#111;padding:2px 6px;border-radius:4px;">v1.0-submission</code></li>
        </ul>
      </div>
      <hr style="border-color:#1a1a1a;margin:24px 0;">
      <p style="color:#555;font-size:12px;margin:0;">Robotics Club Platform — This is an automated confirmation email.</p>
    </div>
    """
    send_email(to_emails, subject, body)


def send_announcement_email(to_emails: list[str], title: str, message: str):
    subject = f"Robotics Club — {title}"
    body = f"""
    <div style="font-family:sans-serif;padding:32px;background:#0a0a0f;color:#e0e0e0;max-width:600px;margin:auto;border-radius:12px;">
      <h1 style="color:#00d4ff;font-size:22px;margin:0 0 16px;">{title}</h1>
      <p style="line-height:1.7;color:#ccc;">{message}</p>
      <hr style="border-color:#1a1a1a;margin:24px 0;">
      <p style="color:#555;font-size:12px;">Robotics Club Platform</p>
    </div>
    """
    send_email(to_emails, subject, body)


def send_contact_email(name: str, email: str, subject: str, message: str):
    club_email = SMTP_EMAIL or CLUB_EMAIL
    # Email to club
    body_to_club = f"""
    <div style="font-family:sans-serif;padding:32px;background:#0a0a0f;color:#e0e0e0;max-width:600px;margin:auto;border-radius:12px;">
      <h2 style="color:#00d4ff;">New Contact Form Submission</h2>
      <p><strong>From:</strong> {name} ({email})</p>
      <p><strong>Subject:</strong> {subject}</p>
      <div style="background:#111;border-left:3px solid #00d4ff;padding:16px;border-radius:0 8px 8px 0;margin:16px 0;">
        <p style="margin:0;white-space:pre-wrap;">{message}</p>
      </div>
    </div>
    """
    # Auto-reply to sender
    body_auto_reply = f"""
    <div style="font-family:sans-serif;padding:32px;background:#0a0a0f;color:#e0e0e0;max-width:600px;margin:auto;border-radius:12px;">
      <h2 style="color:#00d4ff;">We received your message</h2>
      <p>Hi {name}, thank you for reaching out to the Robotics Club.</p>
      <p>We've received your message about <strong>{subject}</strong> and will get back to you within 2-3 business days.</p>
      <hr style="border-color:#1a1a1a;margin:24px 0;">
      <p style="color:#555;font-size:12px;">Robotics Club Platform — Auto-reply</p>
    </div>
    """
    if club_email:
        send_email([club_email], f"Contact: {subject}", body_to_club)
    send_email([email], "We received your message — Robotics Club", body_auto_reply)
