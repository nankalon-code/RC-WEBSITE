# Antigravity Robotics Platform - Backend

This is the FastAPI backend for the Antigravity Robotics Platform. It handles user authentication, JWT session persistence, API routing, database interactions, and email automated responses.

## Security & Repository Instructions

**CRITICAL:** NEVER commit the `.env` file or `robotics.db` file to your GitHub repository.
1. The `.gitignore` file is already configured to ignore `.env`, `*.db`, `__pycache__/`, and `.venv/`.
2. Do **NOT** forcefully add or commit `.env` or `robotics.db`.
3. Your `SECRET_KEY` and database credentials must remain strictly inside the `.env` file on your local machine, and configured as Environment Variables on your hosting provider.

## Setup & Local Development

1. **Create Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in the required values (especially `SECRET_KEY`). If you do not provide a `DATABASE_URL`, it will fall back to a local `sqlite:///./robotics.db`.

4. **Initialize Database & Seed Admin:**
   ```bash
   python seed_admin.py
   ```
   *(This script will prompt you to create the initial super-admin account).*

5. **Start the Development Server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

## Deployment (Railway.app)

1. Push this `robotics-backend` directory to a GitHub repository.
2. Log in to [Railway.app](https://railway.app/).
3. Click **New Project** -> **Deploy from GitHub repo** and select your backend repository.
4. Railway will automatically detect it's a Python app.
5. In your Railway project dashboard, go to the **Variables** tab and add your production environment variables:
   - `SECRET_KEY`: (Generate a secure random string)
   - `DATABASE_URL`: (You can provision a PostgreSQL database directly in Railway and link it)
   - `ALLOWED_ORIGINS`: `https://your-vercel-frontend-url.vercel.app` (CRITICAL for CORS and cookies to work)
   - `SMTP_USER` & `SMTP_PASS` (Optional, if you want emails to work)
6. Railway will build and deploy the app automatically.
7. Note down the public URL provided by Railway (e.g., `https://your-app.up.railway.app`) and use it in your frontend Vercel deployment.
