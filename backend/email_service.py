import smtplib
import os
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

from pathlib import Path
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)
logger = logging.getLogger(__name__)

SMTP_EMAIL = os.environ.get("SMTP_EMAIL", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
CLUB_EMAIL = os.environ.get("ADMIN_EMAIL", "roboticsclub.rtukota@gmail.com")


BREVO_API_KEY = os.environ.get("BREVO_API_KEY", "")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")


def send_email(to_emails: list[str], subject: str, body_html: str):
    # ── Option 1: HTTPS REST API (Port 443) via Resend ───────────────────
    # Highly recommended for cloud platforms (Railway/Render) where SMTP is blocked
    if RESEND_API_KEY:
        import urllib.request
        import json
        try:
            url = "https://api.resend.com/emails"
            headers = {
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json"
            }
            # Resend requires verified custom domains. Defaults to onboarding@resend.dev
            from_email = os.environ.get("RESEND_FROM_EMAIL", "onboarding@resend.dev")
            payload = {
                "from": from_email,
                "to": to_emails,
                "subject": subject,
                "html": body_html
            }
            
            req = urllib.request.Request(
                url, 
                data=json.dumps(payload).encode("utf-8"), 
                headers=headers, 
                method="POST"
            )
            logger.info(f"Attempting email dispatch via Resend HTTPS API (Port 443)...")
            with urllib.request.urlopen(req, timeout=12) as response:
                response.read()
                logger.info(f"[EMAIL SENT via RESEND HTTPS] {subject} → {', '.join(to_emails)}")
            return
        except Exception as e_resend:
            logger.error(f"[RESEND API FAILED] {e_resend}. Trying alternative paths...")

    # ── Option 2: HTTPS REST API (Port 443) via Brevo ────────────────────
    if BREVO_API_KEY:
        import urllib.request
        import json
        try:
            url = "https://api.brevo.com/v3/smtp/email"
            headers = {
                "Accept": "application/json",
                "api-key": BREVO_API_KEY,
                "Content-Type": "application/json"
            }
            sender_email = SMTP_EMAIL if SMTP_EMAIL else CLUB_EMAIL
            payload = {
                "sender": {"email": sender_email, "name": "Robotics Club RTU Kota"},
                "to": [{"email": email} for email in to_emails],
                "subject": subject,
                "htmlContent": body_html
            }
            
            req = urllib.request.Request(
                url, 
                data=json.dumps(payload).encode("utf-8"), 
                headers=headers, 
                method="POST"
            )
            logger.info(f"Attempting email dispatch via Brevo HTTPS API (Port 443)...")
            with urllib.request.urlopen(req, timeout=12) as response:
                response.read()
                logger.info(f"[EMAIL SENT via BREVO HTTPS] {subject} → {', '.join(to_emails)}")
            return
        except Exception as e_brevo:
            logger.error(f"[BREVO API FAILED] {e_brevo}. Falling back to standard SMTP...")

    if not SMTP_EMAIL or not SMTP_PASSWORD:
        logger.info(f"[EMAIL MOCK] TO: {', '.join(to_emails)} | SUBJECT: {subject}")
        return
    
    # Attempt 1: Port 587 with TLS
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SMTP_EMAIL
        msg["To"] = ", ".join(to_emails)
        msg.attach(MIMEText(body_html, "html"))
        
        logger.info(f"Attempting email dispatch via TLS (smtp.gmail.com:587)...")
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=12) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_emails, msg.as_string())
        logger.info(f"[EMAIL SENT via TLS] {subject} → {', '.join(to_emails)}")
        return
    except Exception as e_tls:
        logger.warning(f"TLS email dispatch failed: {e_tls}. Retrying via SSL (smtp.gmail.com:465)...")
        
    # Attempt 2: Fallback to Port 465 with SSL
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SMTP_EMAIL
        msg["To"] = ", ".join(to_emails)
        msg.attach(MIMEText(body_html, "html"))
        
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=12) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, to_emails, msg.as_string())
        logger.info(f"[EMAIL SENT via SSL] {subject} → {', '.join(to_emails)}")
    except Exception as e_ssl:
        logger.error(f"[EMAIL FAILED COMPLETELY] Both TLS & SSL failed. SSL Error: {e_ssl}")


def send_registration_email(to_emails: list[str], team_id: int, team_name: str, idea_title: str, idea_desc: str = ""):
    subject = f"Robotics Club — Project '{idea_title}' Locked Successfully"
    body = f"""
    <div style="font-family:sans-serif;padding:32px;background:#0a0a0f;color:#e0e0e0;max-width:600px;margin:auto;border-radius:12px;border:1px solid #1f2937;">
      <div style="border-bottom:1px solid #222;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="color:#00d4ff;font-size:24px;margin:0;">Project Locked Confirmed</h1>
      </div>
      <p>Congratulations, members of <strong style="color:#fff;">{team_name}</strong>!</p>
      <p>Your team has successfully locked and registered for the following project idea on the Robotics Club Forum:</p>
      
      <div style="background:#111;border:1px solid #222;border-radius:8px;padding:20px;margin:20px 0;">
        <h2 style="color:#fff;margin:0 0 8px;">{idea_title}</h2>
        <p style="color:#888;font-size:14px;margin:0;">{idea_desc}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="color:#888;padding:8px 0;border-bottom:1px solid #1a1a1a;">Team ID</td>
          <td style="color:#fff;padding:8px 0;border-bottom:1px solid #1a1a1a;text-align:right;"><strong>#{team_id}</strong></td>
        </tr>
        <tr>
          <td style="color:#888;padding:8px 0;border-bottom:1px solid #1a1a1a;">Team Name</td>
          <td style="color:#fff;padding:8px 0;border-bottom:1px solid #1a1a1a;text-align:right;"><strong>{team_name}</strong></td>
        </tr>
        <tr>
          <td style="color:#888;padding:8px 0;border-bottom:1px solid #1a1a1a;">Project Deadline</td>
          <td style="color:#00d4ff;padding:8px 0;border-bottom:1px solid #1a1a1a;text-align:right;"><strong>A deadline for your project will be informed soon</strong></td>
        </tr>
      </table>

      <div style="background:#0d1a1f;border:1px solid #00d4ff22;border-radius:8px;padding:20px;margin-bottom:24px;">
        <h3 style="color:#00d4ff;margin:0 0 12px;font-size:16px;">Next Steps</h3>
        <ul style="color:#aaa;font-size:14px;margin:0;padding-left:20px;line-height:1.8;">
          <li>Create a public GitHub repository for your project collaboration.</li>
          <li>Submit the repo URL in your User Dashboard to track progress.</li>
          <li>A detailed timeline and intermediate check-in dates will be sent by the coordination team shortly.</li>
        </ul>
      </div>
      
      <hr style="border-color:#1a1a1a;margin:24px 0;">
      <p style="color:#555;font-size:12px;margin:0;">Robotics Club Platform — This is an automated notification.</p>
    </div>
    """
    send_email(to_emails, subject, body)


def send_welcome_user_email(to_email: str, name: str):
    subject = "Welcome to the Robotics Club Platform!"
    body = f"""
    <div style="font-family:sans-serif;padding:32px;background:#0a0a0f;color:#e0e0e0;max-width:600px;margin:auto;border-radius:12px;border:1px solid #1f2937;">
      <div style="border-bottom:1px solid #222;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="color:#00d4ff;font-size:24px;margin:0;">Welcome aboard, {name}!</h1>
      </div>
      <p>Thank you for joining the Robotics Club platform!</p>
      <p>Your account has been registered successfully. Here is what you can do on the platform right now:</p>
      
      <div style="background:#111;border:1px solid #222;border-radius:8px;padding:20px;margin:20px 0;">
        <ul style="color:#aaa;font-size:14px;margin:0;padding-left:20px;line-height:1.8;">
          <li>Browse through 50+ curated project ideas on the <strong>Forum</strong>.</li>
          <li>Form a team of 2 to 4 students.</li>
          <li>Lock your favorite available project and start building!</li>
        </ul>
      </div>

      <p>If you have applied to become an official Core Member of the club, your request is currently under review by our administration. Once assigned as a Member, you will receive full access and a congratulatory notification!</p>

      <hr style="border-color:#1a1a1a;margin:24px 0;">
      <p style="color:#555;font-size:12px;margin:0;">Robotics Club Platform — This is an automated welcome email.</p>
    </div>
    """
    send_email([to_email], subject, body)


def send_member_promotion_email(to_email: str, name: str):
    subject = "Congratulations! You are now a Core Member of the Robotics Club"
    body = f"""
    <div style="font-family:sans-serif;padding:32px;background:#0a0a0f;color:#e0e0e0;max-width:600px;margin:auto;border-radius:12px;border:1px solid #1f2937;">
      <div style="border-bottom:1px solid #222;padding-bottom:16px;margin-bottom:24px;">
        <h1 style="color:#22c55e;font-size:24px;margin:0;">Congratulations, {name}! 🎉</h1>
      </div>
      <p>We are absolutely thrilled to inform you that you have been promoted and assigned as an official <strong>Core Member</strong> of the Robotics Club!</p>
      
      <div style="background:#0d1f14;border:1px solid #22c55e22;border-radius:8px;padding:20px;margin:20px 0;">
        <p style="color:#22c55e;font-size:16px;margin:0 0 8px;font-weight:bold;">Welcome to the Core Engineering Team</p>
        <p style="color:#aaa;font-size:14px;margin:0;line-height:1.6;">
          As a Core Member, you now have enhanced access to our laboratory resources, direct guidance from our coordinators, and participation in exclusive national contests.
        </p>
      </div>

      <p>Log in to your dashboard to view your new Member layout, track your attendance, update project repositories, and access exclusive learning resources.</p>

      <hr style="border-color:#1a1a1a;margin:24px 0;">
      <p style="color:#555;font-size:12px;margin:0;">Robotics Club Platform — Core Member Announcement.</p>
    </div>
    """
    send_email([to_email], subject, body)


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
