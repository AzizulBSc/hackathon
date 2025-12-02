# Hackathon Project

This project consists of a Laravel backend API and a Next.js frontend
application.

## Project Structure

```
hackathon/
├── backend/          # Laravel 10 API (Latest for PHP 8.1)
├── frontend/         # Next.js 16 (Latest) with JavaScript & Tailwind CSS
└── README.md
```

## Backend (Laravel)

### Setup

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
```

### Running the Backend

```bash
cd backend
php artisan serve
```

The backend will run on `http://localhost:8000`

### Available Commands

- `php artisan serve` - Start development server
- `php artisan migrate` - Run database migrations
- `php artisan make:model ModelName -m` - Create model with migration
- `php artisan make:controller ControllerName` - Create controller
- `php artisan test` - Run tests

## Frontend (Next.js)

### Setup

```bash
cd frontend
npm install
```

### Running the Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

### Backend

- Laravel 10
- PHP
- MySQL/PostgreSQL (configure in .env)
- Laravel Sanctum (API authentication)

### Frontend

- Next.js 16 (Latest)
- React 19
- JavaScript (ES6+)
- Tailwind CSS
- ESLint

## API Configuration

To connect the frontend to the backend, update the API base URL in your Next.js
environment variables:

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## CORS Configuration

The Laravel backend needs to allow requests from the Next.js frontend. Update
`backend/config/cors.php` if needed.

## Database Setup

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
