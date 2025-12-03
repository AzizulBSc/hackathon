# SmartSupport - AI-Powered Customer Support Portal

## 🎯 Project Overview

**SmartSupport** is a unified customer service platform combining efficient
ticket management with an AI-powered chatbot for instant customer assistance.

## 📋 Project Details

### 1. Project Title

**SmartSupport – AI-Powered Customer Support & Ticketing Portal**

### 2. Category

Web Application (SaaS / AI Integration / Customer Service)

### 3. Problem Statement

Businesses struggle with:

- High volume of repetitive customer queries
- Slow manual ticket management
- Reduced customer satisfaction
- Overwhelmed support teams

### 4. Proposed Solution

- **Instant AI Assistance**: Chatbot trained on FAQ database
- **Smart Ticket System**: Automated ticket generation from unresolved queries
- **Unified Dashboard**: Single interface for all customer interactions
- **Multi-Role System**: Admin, Agent, and Customer portals

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (Latest)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Features**:
  - Real-time chat UI
  - Ticket dashboard
  - Admin panel
  - Responsive design

### Backend

- **Framework**: Laravel 10
- **Language**: PHP 8.1+
- **Authentication**: Laravel Sanctum
- **Features**:
  - RESTful API
  - Role-based access control
  - Ticket management
  - AI chatbot integration

### Database

- **System**: MySQL
- **Tables**:
  - `users` (with roles: admin, agent, customer)
  - `tickets` (support tickets)
  - `messages` (ticket conversations)
  - `faqs` (knowledge base)

### AI/ML

- **Options**:
  - Hugging Face Inference API (Mistral, Mixtral)
  - Google Gemini Free Tier
  - OpenRouter (free LLMs)
- **Features**:
  - FAQ matching
  - Response generation
  - Query classification
  - Agent reply suggestions

## 📊 Database Schema

```sql
users
- id
- name
- email
- password
- role (customer, agent, admin)
- is_active
- timestamps

tickets
- id
- ticket_number (unique, auto-generated)
- subject
- description
- status (open, in_progress, resolved, closed)
- priority (low, medium, high, urgent)
- created_by (user_id)
- assigned_to (user_id, nullable)
- resolved_at
- timestamps

messages
- id
- ticket_id
- sender_id (user_id)
- message
- is_internal (agent notes)
- is_bot (AI responses)
- timestamps

faqs
- id
- category
- question
- answer
- is_active
- views (counter)
- timestamps
```

## 🎨 Key Features

### For Customers

✅ Create support tickets ✅ Chat with AI assistant ✅ Track ticket status ✅
View conversation history ✅ Browse FAQ library

### For Agents

✅ View assigned tickets ✅ Respond to customer queries ✅ Add internal notes ✅
Update ticket status ✅ AI-suggested replies ✅ View customer history

### For Admins

✅ Dashboard with analytics ✅ Assign tickets to agents ✅ Manage users and
roles ✅ Manage FAQ database ✅ View all tickets ✅ System settings

## 📈 Project Timeline

| Week       | Tasks                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| **Week 1** | - Setup project structure<br>- Database design & migrations<br>- Authentication system<br>- Basic UI components |
| **Week 2** | - Ticket CRUD API<br>- Admin dashboard<br>- Agent portal<br>- Customer portal<br>- Role-based permissions       |
| **Week 3** | - AI chatbot integration<br>- Real-time chat<br>- FAQ management<br>- Testing & bug fixes<br>- Deployment       |

## 🚀 Current Progress

### ✅ Completed

1. Project structure initialized
2. Database migrations created:
   - Users table with roles
   - Tickets table with status tracking
   - Messages table for conversations
   - FAQs table for knowledge base
3. Models created with relationships:
   - User model with role methods
   - Ticket model with auto-generated ticket numbers
   - Message model
   - FAQ model with view tracking
4. API Controllers created:
   - TicketController
   - ChatbotController
   - FaqController
   - AuthController

### 🔄 In Progress

- API endpoint development
- Frontend page structure
- AI integration setup

### 📝 To Do

- [ ] Complete API endpoints
- [ ] Build authentication UI
- [ ] Create customer portal
- [ ] Create agent dashboard
- [ ] Create admin panel
- [ ] Integrate AI chatbot API
- [ ] Add real-time features
- [ ] Testing
- [ ] Deployment

## 🔌 API Endpoints (Planned)

### Authentication

```
POST   /api/register
POST   /api/login
POST   /api/logout
GET    /api/user
```

### Tickets

```
GET    /api/tickets              (list with filters)
POST   /api/tickets              (create)
GET    /api/tickets/{id}         (view single)
PUT    /api/tickets/{id}         (update)
DELETE /api/tickets/{id}         (delete)
POST   /api/tickets/{id}/assign  (assign to agent)
POST   /api/tickets/{id}/status  (update status)
```

### Messages

```
GET    /api/tickets/{id}/messages
POST   /api/tickets/{id}/messages
```

### Chatbot

```
POST   /api/chatbot/query        (ask question)
GET    /api/chatbot/suggestions  (get FAQ suggestions)
```

### FAQs

```
GET    /api/faqs                 (list all)
POST   /api/faqs                 (create - admin)
PUT    /api/faqs/{id}            (update - admin)
DELETE /api/faqs/{id}            (delete - admin)
```

### Dashboard

```
GET    /api/dashboard/stats      (admin/agent)
GET    /api/dashboard/recent     (recent tickets)
```

## 🎯 AI Integration Plan

### Free LLM Options:

1. **Hugging Face Inference API**

   - Model: `mistralai/Mixtral-8x7B-Instruct-v0.1`
   - Free tier: Rate limited
   - Setup: API token from huggingface.co

2. **Google Gemini**

   - Model: `gemini-pro`
   - Free tier: 60 requests/minute
   - Setup: API key from Google AI Studio

3. **OpenRouter**
   - Multiple free models available
   - Fallback options
   - Setup: API key from openrouter.ai

### Chatbot Features:

- Match customer query with FAQ database
- Generate contextual responses
- Escalate to ticket if unresolved
- Learn from agent responses
- Suggest replies to agents

## 🌐 Deployment Plan

### Frontend (Next.js)

- **Platform**: Vercel
- **Features**:
  - Auto-deploy from GitHub
  - Environment variables
  - Custom domain support
  - CDN & caching

### Backend (Laravel)

- **Platform**: Railway / Render
- **Features**:
  - PostgreSQL database
  - Environment variables
  - Automatic HTTPS
  - CI/CD integration

### Database

- **Platform**: PlanetScale (MySQL)
- **Features**:
  - Free tier: 5GB storage
  - Automatic backups
  - High availability

## 📱 Mobile Support

- Responsive web design (mobile-first)
- PWA capabilities
- Push notifications (optional)

## 🔒 Security Features

- JWT authentication via Laravel Sanctum
- Role-based access control
- Input validation & sanitization
- CSRF protection
- Rate limiting
- XSS prevention

## 📚 Documentation

- API documentation (Postman/Swagger)
- User guide
- Admin manual
- Developer setup guide

## 🎥 Demo Features

1. Customer creates ticket
2. AI chatbot responds instantly
3. If unresolved, auto-create ticket
4. Agent receives notification
5. Agent responds with AI suggestions
6. Customer receives update
7. Admin views analytics dashboard

## 🏆 Hackathon Advantages

- **Practical**: Solves real business problem
- **Scalable**: Can be extended with more features
- **AI Integration**: Shows ML/AI knowledge
- **Full Stack**: Demonstrates complete skillset
- **Modern Tech**: Latest frameworks & tools
- **Deployable**: Can be shown live

## 📦 Resources Needed

- [ ] Hugging Face API key (free)
- [ ] Vercel account (free)
- [ ] Railway/Render account (free)
- [ ] GitHub repository
- [ ] Figma for mockups (optional)

## 🎯 Success Metrics

- Response time < 2 seconds
- 70%+ queries resolved by AI
- 30%+ reduction in agent workload
- 90%+ customer satisfaction
- < 1 hour average ticket resolution

## 🚀 Getting Started

### Prerequisites

- PHP 8.1+
- Composer
- Node.js 18+
- MySQL
- Git

### Installation

```bash
# Clone repository
git clone <repo-url>
cd hackathon

# Backend setup
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend setup
cd ../frontend
npm install
npm run dev
```

### Environment Variables

**Backend (.env)**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smartsupport
DB_USERNAME=root
DB_PASSWORD=

HUGGINGFACE_API_KEY=your_key_here
```

**Frontend (.env.local)**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📞 Support

For questions or issues, please create a GitHub issue.

---

**Project Status**: 🔄 In Development **Target Completion**: Week 3 **Demo
Ready**: Week 2 End

**Let's build something amazing! 🚀**
