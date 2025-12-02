#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Hackathon Project Quick Start${NC}"
echo -e "${BLUE}================================${NC}\n"

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo -e "${RED}Error: backend directory not found!${NC}"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo -e "${RED}Error: frontend directory not found!${NC}"
    exit 1
fi

# Backend setup
echo -e "${GREEN}Setting up Backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    php artisan key:generate
fi

echo "Installing backend dependencies..."
composer install

echo -e "${GREEN}Backend setup complete!${NC}\n"

# Frontend setup
cd ../frontend
echo -e "${GREEN}Setting up Frontend...${NC}"

if [ ! -f ".env.local" ]; then
    echo "Environment file already exists!"
fi

echo "Installing frontend dependencies..."
npm install

echo -e "${GREEN}Frontend setup complete!${NC}\n"

# Return to root
cd ..

echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${BLUE}================================${NC}\n"

echo "To start the servers, run:"
echo -e "${GREEN}Terminal 1:${NC} cd backend && php artisan serve"
echo -e "${GREEN}Terminal 2:${NC} cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
