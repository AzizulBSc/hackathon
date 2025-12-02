const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');

// Import rate limiters
const { apiLimiter, authLimiter, chatLimiter } = require('./middleware/rateLimiter');

// Initialize database
require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Apply rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tickets', apiLimiter, ticketRoutes);
app.use('/api/chat', chatLimiter, chatRoutes);
app.use('/api/users', apiLimiter, userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartSupport API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SmartSupport API running on port ${PORT}`);
  });
}

module.exports = app;
