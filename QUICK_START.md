# 🚀 Quick Start Guide - SmartSupport

## ✅ Login Error Fix - Complete Solution

### Problem:

Login page showing "Network error" because backend API was not running.

### Solution:

Backend API endpoints এখন তৈরি হয়ে গেছে। শুধু server গুলো চালু করতে হবে।

---

## 🔧 How to Run the Project

### Method 1: Using Helper Scripts (Easiest)

**Terminal 1 - Start Backend:**

```bash
cd /var/www/html/hackathon
./start-backend.sh
```

**Terminal 2 - Start Frontend:**

```bash
cd /var/www/html/hackathon
./start-frontend.sh
```

### Method 2: Manual Start

**Terminal 1 - Backend (Laravel):**

```bash
cd /var/www/html/hackathon/backend
php artisan serve
```

Backend will run at: `http://localhost:8000`

**Terminal 2 - Frontend (Next.js):**

```bash
cd /var/www/html/hackathon/frontend
npm run dev
```

Frontend will run at: `http://localhost:3000`

---

## 🧪 Test Login

### Option 1: Use Browser

1. Open: `http://localhost:3000/login`
2. Click any Quick Login button:
   - 👤 Customer
   - 🎧 Agent
   - ⚙️ Admin

### Option 2: Use cURL (Command Line)

```bash
# Test Customer Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "customer@test.com",
    "password": "password"
  }'

# Test Agent Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "agent@test.com",
    "password": "password"
  }'

# Test Admin Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password"
  }'
```

### Expected Response:

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Customer",
    "email": "customer@test.com",
    "role": "customer"
  },
  "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

---

## 🎯 What Was Fixed

### 1. Created AuthController ✅

File: `backend/app/Http/Controllers/Api/AuthController.php`

**Methods Added:**

- `register()` - Register new user
- `login()` - Login with email/password
- `logout()` - Logout (delete token)
- `me()` - Get authenticated user info

### 2. Added API Routes ✅

File: `backend/routes/api.php`

**Public Routes:**

- `POST /api/register` - User registration
- `POST /api/login` - User login

**Protected Routes (require auth token):**

- `POST /api/logout` - Logout
- `GET /api/me` - Get user info
- `GET /api/user` - Get user data

### 3. CORS Configuration ✅

File: `backend/config/cors.php`

Already configured to allow all origins (for development).

### 4. Environment Variables ✅

File: `frontend/.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🔑 Demo Accounts

All passwords: `password`

| Role        | Email             | Password | Dashboard           |
| ----------- | ----------------- | -------- | ------------------- |
| 👤 Customer | customer@test.com | password | /customer/dashboard |
| 🎧 Agent    | agent@test.com    | password | /agent/dashboard    |
| ⚙️ Admin    | admin@test.com    | password | /admin/dashboard    |

---

## 🐛 Troubleshooting

### Error: "Network error"

**Cause:** Backend server not running

**Solution:**

```bash
cd backend
php artisan serve
```

### Error: "Connection refused"

**Cause:** Port 8000 already in use

**Solution:**

```bash
# Kill existing process
lsof -ti:8000 | xargs kill -9

# Or use different port
php artisan serve --port=8001

# Update frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8001/api
```

### Error: "CORS policy"

**Cause:** CORS not configured

**Solution:** Already fixed in `config/cors.php`

### Error: "Invalid credentials"

**Cause:** Wrong email/password or database not seeded

**Solution:**

```bash
cd backend
php artisan migrate:fresh --seed
```

---

## 📡 API Endpoints Reference

### Authentication

**Register:**

```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Login:**

```http
POST /api/login
Content-Type: application/json

{
  "email": "customer@test.com",
  "password": "password"
}
```

**Logout:**

```http
POST /api/logout
Authorization: Bearer {token}
```

**Get User:**

```http
GET /api/me
Authorization: Bearer {token}
```

---

## 🧪 Testing Workflow

### 1. Start Servers

```bash
# Terminal 1
cd backend && php artisan serve

# Terminal 2
cd frontend && npm run dev
```

### 2. Test API Health

```bash
curl http://localhost:8000/api/health
```

Expected:

```json
{
  "status": "ok",
  "message": "SmartSupport API is running",
  "timestamp": "2025-12-03 23:00:00",
  "version": "Laravel 10.50.0"
}
```

### 3. Test Login API

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@test.com","password":"password"}'
```

### 4. Test Frontend

1. Open browser: `http://localhost:3000/login`
2. Click "👤 Customer" button
3. Should redirect to `/customer/dashboard`

---

## 🔐 Security Features

✅ Password hashing with bcrypt  
✅ Laravel Sanctum for API authentication  
✅ Token-based authentication  
✅ CSRF protection  
✅ Role-based access control  
✅ Email validation  
✅ Password confirmation

---

## 📊 Project Status

### ✅ Completed:

- [x] Database migrations
- [x] Models with relationships
- [x] Database seeder with demo data
- [x] Frontend customer portal
- [x] **Authentication API (Login/Register)** ← Just Fixed!
- [x] Quick login buttons

### 🔄 In Progress:

- [ ] Agent dashboard frontend
- [ ] Admin dashboard frontend
- [ ] Ticket CRUD APIs
- [ ] AI Chatbot integration

### ⏳ Pending:

- [ ] Real-time notifications
- [ ] Email notifications
- [ ] File attachments
- [ ] Deployment

---

## 🎉 Success!

Your login is now working! 🚀

**Next Steps:**

1. Start both servers (backend + frontend)
2. Go to `http://localhost:3000/login`
3. Click any Quick Login button
4. You'll be logged in and redirected!

---

## 📞 Need Help?

Check these files:

- `DATABASE_SEEDER.md` - Demo accounts info
- `AGENT.md` - Agent dashboard guide
- `project-docs.txt` - Project overview

---

**Happy Coding! 💻✨**
