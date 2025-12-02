const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getChatHistory,
  clearChatHistory,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
} = require('../controllers/chatController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Chat routes
router.post('/message', sendMessage);
router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);

// FAQ routes (admin only for modifications)
router.get('/faqs', getFAQs);
router.post('/faqs', authorize('admin'), createFAQ);
router.put('/faqs/:id', authorize('admin'), updateFAQ);
router.delete('/faqs/:id', authorize('admin'), deleteFAQ);

module.exports = router;
