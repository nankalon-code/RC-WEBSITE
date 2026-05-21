# Antigravity Robotics Platform - Frontend

This is the React (Vite) frontend for the Antigravity Robotics Platform. It features a modern, pitch-black glassmorphic UI, dynamic routing, 3D elements, and smooth interactions.

## Security & Repository Instructions

**CRITICAL:** NEVER commit the `.env` file to your GitHub repository.
1. The `.gitignore` file is already configured to ignore `.env`, `.env.*`, and `node_modules/`.
2. Do **NOT** forcefully add or commit `.env`.
3. You can safely push all other files to your public repository.

## Setup & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and configure the backend URL (leave as localhost for local testing):
   ```env
   VITE_API_URL="http://localhost:8000"
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## Deployment (Vercel)

1. Push this `robotics-club` directory to a GitHub repository.
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New Project** and import your GitHub repository.
4. Set the **Framework Preset** to `Vite`.
5. Under **Environment Variables**, add:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-railway-app.up.railway.app` (Replace with your actual Railway backend URL)
6. Click **Deploy**. Vercel will automatically build and host your site.
