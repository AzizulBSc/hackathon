# 🚀 Hackathon Project - Setup Summary

## ✅ Project Successfully Initialized!

Your full-stack application has been set up with Laravel backend and Next.js
frontend.

## 📁 Project Structure

```
hackathon/
├── backend/                    # Laravel 10 API
│   ├── app/                   # Application code
│   ├── routes/                # API routes
│   ├── config/                # Configuration files
│   ├── database/              # Migrations & seeders
│   └── .env                   # Environment variables
│
├── frontend/                   # Next.js Application
│   ├── src/
│   │   ├── app/              # App router pages
│   │   └── lib/              # Utilities (API client)
│   ├── public/                # Static assets
│   └── .env.local             # Frontend environment
│
├── README.md                   # English documentation
├── SETUP_BANGLA.md            # বাংলা ডকুমেন্টেশন
└── setup.sh                   # Quick setup script
```

## 🎯 Quick Start

### Option 1: Using the Setup Script

```bash
./setup.sh
```

### Option 2: Manual Setup

**Terminal 1 - Backend:**

```bash
cd backend
php artisan serve
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Health Check:** http://localhost:8000/api/health

## 🛠️ What's Included

### Backend Features:

- ✅ Laravel 10 with latest dependencies
- ✅ API routes configured (`routes/api.php`)
- ✅ CORS enabled for frontend
- ✅ Sanctum for authentication (ready to use)
- ✅ Health check endpoint
- ✅ Example API endpoints

### Frontend Features:

- ✅ Next.js 16 (Latest) with App Router
- ✅ JavaScript (ES6+) configured
- ✅ Tailwind CSS for styling
- ✅ API client utility (`src/lib/api.js`)
- ✅ Beautiful landing page with API status
- ✅ Environment variables configured

## 📝 Next Steps

1. **Configure Database:**

   - Update `backend/.env` with your database credentials
   - Run migrations: `cd backend && php artisan migrate`

2. **Start Building:**

   - Create models: `php artisan make:model ModelName -m`
   - Create controllers: `php artisan make:controller ControllerName`
   - Add API routes in `backend/routes/api.php`
   - Build frontend pages in `frontend/src/app/`

3. **API Integration:**

   - Use the `apiClient` from `frontend/src/lib/api.js`
   - Example:

   ```javascript
   import { apiClient } from "@/lib/api";

   const response = await apiClient.get("/v1/test");
   ```

## 🔧 Common Commands

### Backend (Laravel):

```bash
php artisan serve              # Start server
php artisan migrate            # Run migrations
php artisan make:model User -m # Create model
php artisan make:controller    # Create controller
php artisan test               # Run tests
```

### Frontend (Next.js):

```bash
npm run dev                    # Development server
npm run build                  # Production build
npm run lint                   # Run linter
```

## 📚 Documentation Links

- [Laravel Documentation](https://laravel.com/docs/10.x)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 🐛 Troubleshooting

If you encounter any issues:

1. **Port conflicts:** Change ports in commands

   - Laravel: `php artisan serve --port=8001`
   - Next.js: `npm run dev -- -p 3001`

2. **Database errors:** Check `.env` file in backend
3. **API not connecting:** Ensure both servers are running
4. **CORS errors:** Check `backend/config/cors.php`

## 💡 Pro Tips

1. Keep both servers running while developing
2. Use API client helper for all API calls
3. Check browser console for API errors
4. Use Laravel Tinker for quick testing: `php artisan tinker`
5. Use Next.js dev tools for debugging

## 🎨 Customization

- **Styling:** Edit Tailwind config in `frontend/tailwind.config.ts`
- **API Base URL:** Update `frontend/.env.local`
- **Database:** Configure in `backend/.env`
- **CORS Settings:** Modify `backend/config/cors.php`

## 📞 Support

For detailed setup in Bangla, check `SETUP_BANGLA.md`

---

**Ready to build something amazing! 🚀**

Happy coding!
