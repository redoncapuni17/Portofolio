# Personal Portfolio Website

A modern, full-stack personal portfolio with a CMS-style Admin Dashboard. Built with **React + FastAPI + SQLite**, containerized with **Docker**.

---

## ✨ Features

### Public Website
- **Homepage** — animated hero, featured projects, skills preview
- **About** — profile photo, bio, contact info, personal highlights
- **Experience** — timeline layout with technologies
- **Education** — academic history
- **Skills** — categorized with animated progress bars
- **Projects** — searchable/filterable cards with GitHub + live demo links
- **Certifications** — credential cards with verification links
- **Contact** — form that stores messages in the database

### Admin Dashboard (`/admin`)
- JWT-authenticated, bcrypt password hashing
- **Dashboard** — stats overview with Recharts visualizations
- **Profile** — photo upload, CV upload, all personal info
- **Experiences** — full CRUD with modal editor
- **Education** — full CRUD
- **Skills** — grouped by category with proficiency sliders
- **Projects** — full CRUD with image upload, featured flag
- **Certifications** — full CRUD with image upload
- **Messages** — read/archive/delete inbox
- **Social Links** — manage all platform links
- **SEO** — per-page meta title, description, keywords

---

## 🚀 Quick Start with Docker

```bash
# 1. Clone / download the project
cd portfolio

# 2. Copy env and customize
cp .env.example .env
# Edit .env to set your SECRET_KEY

# 3. Launch
docker compose up -d

# Website:     http://localhost
# Admin:       http://localhost/admin
# API Docs:    http://localhost/api/docs  (via backend proxy)
```

---

## 🛠 Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# API Docs: http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:3000
```

> The Vite dev server proxies `/api` → `http://localhost:8000`

---

## 🔑 Default Admin Credentials

```
Email:    admin@portfolio.com
Password: Admin@123456
```

**Change immediately** via Admin → Change Password, or set `ADMIN_PASSWORD` in `.env` before first run.

---

## 🗂 Project Structure

```
portfolio/
├── backend/                   # FastAPI application
│   ├── main.py                # Entry point
│   ├── app/
│   │   ├── api/routes/        # All REST endpoints
│   │   ├── core/              # Config, security, JWT
│   │   ├── db/                # SQLAlchemy session, init
│   │   └── models/            # Database models
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                  # React application
│   ├── src/
│   │   ├── pages/             # Public + Admin pages
│   │   ├── components/        # Layout, UI primitives
│   │   ├── hooks/             # useAuth context
│   │   └── lib/               # Axios API client
│   ├── tailwind.config.js
│   ├── nginx.conf             # Production SPA routing
│   └── Dockerfile             # Multi-stage build
│
├── docker-compose.yml
└── .env.example
```

---

## 📡 API Reference

All endpoints are documented at `http://localhost:8000/docs` (Swagger UI).

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Get JWT token |
| GET | `/api/profile/` | Public profile |
| GET | `/api/experiences/` | Work history |
| GET | `/api/education/` | Education |
| GET | `/api/skills/` | Skills grouped by category |
| GET | `/api/projects/` | Projects (filterable) |
| GET | `/api/certifications/` | Certifications |
| POST | `/api/contact/` | Submit contact form |
| GET | `/api/social-links/` | Active social links |
| GET | `/api/seo/{page}` | Page SEO settings |
| GET | `/api/dashboard/stats` | 🔒 Admin stats |

Protected routes require `Authorization: Bearer <token>`.

---

## 🐳 Docker Volumes

| Volume | Contents |
|--------|----------|
| `db_data` | SQLite database (`portfolio.db`) |
| `uploads_data` | Profile photos, project images, CVs, cert images |

---

## 🎨 Design System

Built with **Tailwind CSS** using a custom dark-mode palette:

- Background: `#0a0a0b` / `#111113` / `#18181b`
- Surface: `#1c1c1f` with hover `#242428`
- Accent: `#7c3aed` (violet) with light `#8b5cf6`
- Text: `#fafafa` / `#a1a1aa` / `#71717a`

Typography: **Inter** (body) + **JetBrains Mono** (code)

---

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | (required) | JWT signing secret |
| `ADMIN_EMAIL` | `admin@portfolio.com` | Initial admin email |
| `ADMIN_PASSWORD` | `Admin@123456` | Initial admin password |
| `ADMIN_NAME` | `Admin User` | Initial admin display name |
| `DATABASE_URL` | `sqlite:///./portfolio.db` | Database connection |
| `UPLOAD_DIR` | `uploads` | File upload directory |
