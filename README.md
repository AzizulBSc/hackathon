# 🚀 SmartSupport - AI-Powered Customer Support Portal# Hackathon Project

## ✅ Project Complete!This project consists of a Laravel backend API and a Next.js frontend

application.

A full-stack customer support system with AI chatbot, ticket management, and
role-based dashboards.

## Project Structure

---

`````

## 🎯 Quick Starthackathon/

├── backend/          # Laravel 10 API (Latest for PHP 8.1)

### Start Backend:├── frontend/         # Next.js 16 (Latest) with JavaScript & Tailwind CSS

```bash└── README.md

cd backend```

php artisan serve

```## Backend (Laravel)



### Start Frontend:### Setup

```bash

cd frontend```bash

npm run devcd backend

```cp .env.example .env

composer install

### Login:php artisan key:generate

- Frontend: `http://localhost:3000`php artisan migrate

- Backend API: `http://localhost:8000````



---### Running the Backend



## 🔑 Demo Accounts```bash

cd backend

| Role | Email | Password |php artisan serve

|------|-------|----------|```

| 👤 Customer | customer@test.com | password |

| 🎧 Agent | agent@test.com | password |The backend will run on `http://localhost:8000`

| ⚙️ Admin | admin@test.com | password |

### Available Commands

---

- `php artisan serve` - Start development server

## ✨ Features Completed- `php artisan migrate` - Run database migrations

- `php artisan make:model ModelName -m` - Create model with migration

### ✅ Backend (Laravel 10)- `php artisan make:controller ControllerName` - Create controller

- Authentication API (Login/Register/Logout)- `php artisan test` - Run tests

- Ticket Management CRUD

- AI Chatbot with FAQ integration## Frontend (Next.js)

- Role-based access control

- RESTful API endpoints### Setup



### ✅ Frontend (Next.js 16)```bash

- Customer Dashboard (shadcn/ui)cd frontend

- Agent Dashboard (shadcn/ui)npm install

- Admin Dashboard (shadcn/ui)```

- AI Chatbot Interface

- Quick Login Buttons### Running the Frontend

- Responsive Design

```bash

### ✅ Databasecd frontend

- 16 demo usersnpm run dev

- 30 pre-seeded tickets```

- 20 FAQ articles

- 100+ messagesThe frontend will run on `http://localhost:3000`



---### Available Commands



## 📡 API Endpoints- `npm run dev` - Start development server

- `npm run build` - Build for production

```- `npm start` - Start production server

POST   /api/login              # Login- `npm run lint` - Run ESLint

POST   /api/register           # Register

GET    /api/tickets            # Get tickets## Technologies Used

POST   /api/tickets            # Create ticket

POST   /api/tickets/{id}/reply # Reply to ticket### Backend

POST   /api/chatbot/query      # Chat with bot

```- Laravel 10

- PHP

---- MySQL/PostgreSQL (configure in .env)

- Laravel Sanctum (API authentication)

## 📚 Documentation

### Frontend

- **QUICK_START.md** - Detailed setup guide

- **DATABASE_SEEDER.md** - Demo data information- Next.js 16 (Latest)

- **AGENT.md** - Agent handbook- React 19

- **project-docs.txt** - Project overview- JavaScript (ES6+)

- Tailwind CSS

---- ESLint



## 🛠️ Tech Stack## API Configuration



- **Backend:** Laravel 10, MySQLTo connect the frontend to the backend, update the API base URL in your Next.js

- **Frontend:** Next.js 16, React 19environment variables:

- **UI:** shadcn/ui, Tailwind CSS

- **Auth:** Laravel SanctumCreate `frontend/.env.local`:

- **AI:** Hugging Face API (optional)

```env

---NEXT_PUBLIC_API_URL=http://localhost:8000/api

`````

## 🎉 Ready to Demo!

## CORS Configuration

Open `http://localhost:3000` and click any Quick Login button!

The Laravel backend needs to allow requests from the Next.js frontend. Update

---`backend/config/cors.php` if needed.

**Built for Hackathon 2025** 🏆## Database Setup

1. Create a database for your project
2. Update `.env` file in the backend directory:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

3. Run migrations:

```bash
cd backend
php artisan migrate
```

## Deployment

### Backend Deployment

- Configure your web server (Apache/Nginx)
- Set up environment variables
- Run `php artisan config:cache`
- Run `php artisan route:cache`

### Frontend Deployment

- Run `npm run build`
- Deploy to Vercel, Netlify, or your preferred hosting

## Development Workflow

1. Start the backend: `cd backend && php artisan serve`
2. Start the frontend: `cd frontend && npm run dev`
3. Access the application at `http://localhost:3000`
4. API endpoints available at `http://localhost:8000/api`

## License

Open source - customize as needed
