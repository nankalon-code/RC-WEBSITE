# 🤖 Robotics Club Platform — Full-Stack Portal

Welcome to the **Robotics Club Platform**, a premium, state-of-the-art web portal designed for robotics enthusiasts, club members, and administrators. The application features a stunning tech-inspired dark aesthetic, dynamic animations, and a robust dual-token authenticated system that handles member management, forum project locking, and automated communication workflows.

---

## 🔑 Authentication Architecture

The application implements a secure, custom **Dual-Token JWT Authentication Flow**:

1. **Access Token (Short-Lived)**:
   * **Format**: JSON Web Token (JWT)
   * **Transmission**: Sent via the standard `Authorization: Bearer <token>` HTTP header.
   * **Purpose**: Authorizes client-side API requests to restricted endpoints in real-time.
2. **Refresh Token (Long-Lived)**:
   * **Format**: Secure HTTP-Only Cookie (`rc_refresh_token`)
   * **Security Parameters**: `httpOnly`, `secure`, `sameSite="Lax"`
   * **Purpose**: Handled directly by the browser to securely refresh the access token in the background when it expires, eliminating the need for manual user re-logins.
3. **Password Cryptography**:
   * Uses **Passlib** with the **Bcrypt** hashing algorithm to secure passwords before storing them in the database.

---

## 🛠️ Complete Tech Stack & Tools

### Frontend Architecture
* **React (Vite)**: Ultra-fast build tool and frontend library.
* **Framer Motion**: Drives highly advanced, custom animations (including the complex custom bootloader sequence, spatial radar sweeps, and smooth card hovers).
* **Zustand**: Fast, lightweight state store (`authStore.js`) maintaining persistent frontend session authentication states.
* **React Router DOM**: Client-side single-page routing with integrated guards for public, user, member, and admin dashboards.
* **CSS System**: Curated, harmonious dark-mode palettes, system-adaptive CSS custom properties, and futuristic glassmorphic UI components.

### Backend Architecture
* **FastAPI**: Extremely high-performance Python ASGI web framework.
* **SQLAlchemy (ORM)**: Object-Relational Mapper to interface with SQLite during local testing and PostgreSQL/MySQL in production.
* **SlowAPI**: Rate-limiting module protecting backend API endpoints from brute-force authentication attempts or spam.
* **Pydantic**: Robust data validation and response serialization schemas.
* **Smtplib**: Secure SMTP email dispatch engine sending dynamic, responsive, and beautiful HTML template emails.
* **Uvicorn**: High-performance ASGI production-ready server.

---

## 📂 Project Structure

```text
robotics-club/
├── frontend/                     # React Frontend App
│   ├── src/
│   │   ├── components/           # Reusable UI widgets (Radar, Bootloader, Robot Widget)
│   │   ├── pages/                # Admin Panel, Landing, Forum, Login
│   │   ├── store/                # Zustand global authentication state
│   │   ├── utils/                # API fetch helpers
│   │   └── index.css             # Root CSS system & variable tokens
│   └── package.json
│
└── backend/                      # FastAPI Backend App
    ├── main.py                   # Core API routes & server initialization
    ├── auth.py                   # JWT Token generation, verification, and route guards
    ├── models.py                 # SQLAlchemy database schema models
    ├── schemas.py                # Pydantic data schemas
    ├── email_service.py          # SMTP HTML template email dispatches
    ├── seed_data.py              # 50 preloaded premium projects & default datasets
    ├── database.py               # Session configurations
    └── requirements.txt          # Python dependencies
```

---

## ⚙️ Environment Variables Configuration

To run both applications smoothly, configure the following `.env` configurations:

### Frontend (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
```
*(Point this to your hosted backend URL when deploying live!)*

### Backend (`/backend/.env`)
```env
# Server
SECRET_KEY=your-super-strong-secret-key-phrase
DATABASE_URL=sqlite:///./core_robotics.db
ALLOWED_ORIGINS=http://localhost:5173

# Default Seeding (Created on Startup)
ADMIN_EMAIL=admin@robotics.club
ADMIN_PASSWORD=admin123
ADMIN_NAME=Platform Administrator

# SMTP Email Settings
SMTP_EMAIL=roboticsclub.rtukota@gmail.com
SMTP_PASSWORD=your-app-specific-smtp-password
```

---

## 🚀 Setup & Installation

### 1. Backend Setup (Local)
Ensure you have Python 3.10+ installed:
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the development server
uvicorn main:app --reload --port 8000
```
*The server will start on **`http://localhost:8000`**. The self-healing DB script will automatically initialize the database and seed the 50 premium project ideas!*

### 2. Frontend Setup (Local)
Ensure you have Node.js 18+ installed:
```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start the Vite server
npm run dev
```
*Open **`http://localhost:5173`** in your browser to view the application.*

---

## 🛡️ Self-Healing DB Engine & Migrations

The backend features an intelligent **Self-Healing Schema Engine** inside `database.py` and `main.py`. On application startup:
1. It automatically inspects table schemas dynamically.
2. If new columns (such as achievement categories or gallery items) are added to `models.py`, it patches the active SQLite or production SQL database on the fly without needing manual migration files!
3. It validates that the default site structures, administrator credentials, and 50 forum projects are 100% loaded and synchronized.
