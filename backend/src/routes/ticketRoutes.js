const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  addMessage,
  getStats
} = require('../controllers/ticketController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Ticket routes
router.post('/', createTicket);
router.get('/', getTickets);
router.get('/stats', getStats);
router.get('/:id', getTicket);
router.put('/:id', updateTicket);
router.post('/:id/messages', addMessage);

module.exports = router;
