# Recipe Finder & Meal Planner – React + Django Authentication

This version keeps the original React/Vite recipe application and replaces the demo LocalStorage login/register system with a Django backend.

## Stack
- React + Vite
- React Router
- TheMealDB API
- Django authentication/session system
- SQLite database
- LocalStorage only for favorites and meal-planner data
- React `useState` and `useEffect` remain the main learning hooks

## Project Structure
```text
recipe-finder-meal-planner/
├── src/
├── package.json
├── vite.config.js
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/
│   └── accounts/
└── README_DJANGO.md
```

## 1. Start Django Backend
Open Terminal 1:
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

## 2. Start React Frontend
Open Terminal 2 from the project root:
```powershell
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:
`http://localhost:5173`

## Deploy to Render

The repository includes `render.yaml`, which defines the Django API and React
static site. In Render, choose **New > Blueprint**, connect the
`404error072025-alt/RecipeHub` repository, and apply the blueprint. After the
first deployment, confirm that the frontend URL is included in the backend
services' `CORS_ALLOWED_ORIGINS` and `DJANGO_CSRF_TRUSTED_ORIGINS` environment
variables if you use a custom domain.

## Login/Register API
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`

The Vite development server proxies `/api` to Django at `http://127.0.0.1:8000`.

## Authentication Flow
```text
React Register/Login
        ↓
fetch('/api/auth/...')
        ↓
Django authentication
        ↓
SQLite database
        ↓
Django session cookie
        ↓
React AuthContext
```

## Important
The login/register passwords are now handled by Django's password hashing and authentication system rather than being stored in browser LocalStorage.

The project still stores favorites and the meal planner in LocalStorage because those features were not requested to move to Django.

For production deployment, replace the demo `SECRET_KEY`, set `DEBUG=False`, configure allowed hosts, HTTPS, and use a proper CSRF strategy instead of the simplified JSON auth endpoints used for this academic project.
