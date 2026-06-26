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

---

## 🔒 Security & Repository Hygiene Policy

To prevent sensitive information exposure and keep the repository clean and efficient, the project strictly adheres to the following rules:

### 1. Zero-Secret Leaks (Ignored Environment Files)
All local configuration files that store credentials or secrets **MUST** remain ignored and should never be pushed to GitHub. This includes:
* **`.env` / `.env.*`**: Contains backend secret keys, database credentials, API keys (e.g. Brevo), and SMTP app passwords.
* **`*.db` / `*.sqlite3`**: SQLite database binaries containing live table data and administrator user logs.
* **`db_dump.txt`**: Raw SQL dump files containing database table dumps.

### 2. Zero-Cache Track (Ignored Cache & Build Outputs)
Compiler outputs and dependency cache folders bloat repository history and can leak development system configurations. The following are strictly ignored:
* **`.vite/`**: Vite dependency pre-bundling caches.
* **`node_modules/`**: Large vendor dependency directories.
* **`dist/` / `build/`**: Production bundles.
* **`__pycache__/` / `*.pyc`**: Python bytecode caches.
* **`venv/` / `.venv/`**: Python virtual environment folders.
* **`*.webp`**: Heavy development screen recordings and media diagnostics.

### 3. Required Environment Variables Reference

| Variable | Scope | Description | Default / Example | Security Level |
| :--- | :--- | :--- | :--- | :--- |
| `SECRET_KEY` | Backend | High-entropy signing key for JWT session access tokens | *Generate via python secrets module* | **CRITICAL** (Never expose) |
| `DATABASE_URL` | Backend | Connection string to the SQLite database (local) or PostgreSQL (production) | `sqlite:///./core_robotics.db` | **HIGH** |
| `SMTP_EMAIL` | Backend | Sender email for club registrations and email dispatches | `your_gmail@gmail.com` | **MEDIUM** |
| `SMTP_PASSWORD` | Backend | 16-digit Google App Password for SMTP login | `your_gmail_app_password` | **CRITICAL** (Never expose) |
| `BREVO_API_KEY` | Backend | API Key for mail dispatch via Brevo REST API (HTTPS fallback) | *Brevo REST API Key* | **CRITICAL** (Never expose) |
| `ALLOWED_ORIGINS` | Backend | Comma-separated list of permitted frontend origins for CORS | `http://localhost:5173,http://localhost:3000` | **MEDIUM** |
| `VITE_API_URL` | Frontend | Base URL endpoint for the REST API | `http://localhost:8000` | **LOW** |

