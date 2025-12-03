#!/bin/bash

# Start Laravel Backend Server
echo "🚀 Starting Laravel Backend Server..."
cd backend
php artisan serve --host=0.0.0.0 --port=8000
