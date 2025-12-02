# SmartSupport

SmartSupport is a unified customer service platform that enables businesses to manage customer support tickets efficiently while offering instant assistance through an AI chatbot.

## Features

- **Ticket Management**: Create, view, and manage support tickets with priority levels and status tracking
- **AI Chatbot**: Intelligent assistant trained on FAQs to provide instant support
- **Role-Based Access**: Different views and permissions for customers, agents, and admins
- **Dashboard**: Real-time statistics and overview of ticket status
- **Message Threading**: Communication between customers and agents within tickets

## Tech Stack

- **Backend**: Node.js, Express.js, SQLite (better-sqlite3)
- **Frontend**: React.js with Vite
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/hackathon.git
cd hackathon
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```
The API will be available at http://localhost:3001

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
The frontend will be available at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Tickets
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets` - Get all tickets (filtered by role)
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id` - Update ticket status/priority/assignment
- `POST /api/tickets/:id/messages` - Add message to ticket
- `GET /api/tickets/stats` - Get ticket statistics

### Chat (AI Assistant)
- `POST /api/chat/message` - Send message to AI chatbot
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history` - Clear chat history
- `GET /api/chat/faqs` - Get FAQs
- `POST /api/chat/faqs` - Create FAQ (admin only)

### Users
- `GET /api/users/agents` - Get list of agents
- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)

## User Roles

- **Customer**: Can create tickets, view own tickets, chat with AI assistant
- **Agent**: Can view and respond to tickets, change status/priority
- **Admin**: Full access including user management and FAQ management

## License

ISC