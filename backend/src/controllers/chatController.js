const { v4: uuidv4 } = require('uuid');
const db = require('../database');

// Predefined FAQs and responses for the AI chatbot
const defaultFAQs = [
  {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    response: 'Hello! Welcome to SmartSupport. How can I assist you today?'
  },
  {
    patterns: ['help', 'support', 'assist'],
    response: 'I\'m here to help! You can ask me about creating tickets, checking ticket status, common issues, or I can connect you with a support agent.'
  },
  {
    patterns: ['create ticket', 'new ticket', 'submit ticket', 'open ticket', 'raise ticket'],
    response: 'To create a new support ticket, go to the "My Tickets" section and click "Create New Ticket". Fill in the title and description of your issue, and select a priority level.'
  },
  {
    patterns: ['ticket status', 'check status', 'my tickets', 'view tickets'],
    response: 'You can view all your tickets and their current status in the "My Tickets" section. Tickets can be Open, In Progress, Resolved, or Closed.'
  },
  {
    patterns: ['password reset', 'forgot password', 'reset password', 'change password'],
    response: 'To reset your password, click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a reset link. If you\'re still having trouble, please create a support ticket.'
  },
  {
    patterns: ['account', 'profile', 'settings'],
    response: 'You can manage your account settings by clicking on your profile icon in the top right corner. From there, you can update your name, email, and other preferences.'
  },
  {
    patterns: ['payment', 'billing', 'invoice', 'refund'],
    response: 'For billing and payment inquiries, please create a support ticket with the category "Billing". Our finance team will assist you within 24-48 hours.'
  },
  {
    patterns: ['hours', 'working hours', 'business hours', 'support hours'],
    response: 'Our support team is available 24/7 for urgent issues. For general inquiries, agents are available Monday-Friday, 9 AM - 6 PM EST.'
  },
  {
    patterns: ['contact', 'phone', 'email support', 'call'],
    response: 'You can reach us via this chat, create a support ticket, or email us at support@smartsupport.com. For urgent matters, you can call +1-800-SUPPORT.'
  },
  {
    patterns: ['thank', 'thanks', 'thank you', 'appreciate'],
    response: 'You\'re welcome! Is there anything else I can help you with?'
  },
  {
    patterns: ['bye', 'goodbye', 'see you', 'close'],
    response: 'Thank you for using SmartSupport! Have a great day. Feel free to return if you need further assistance.'
  }
];

// Simple keyword matching for chatbot responses
const findResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // First check database FAQs
  const faqs = db.prepare('SELECT * FROM faqs').all();
  for (const faq of faqs) {
    if (lowerMessage.includes(faq.question.toLowerCase())) {
      return faq.answer;
    }
  }

  // Then check predefined patterns
  for (const faq of defaultFAQs) {
    for (const pattern of faq.patterns) {
      if (lowerMessage.includes(pattern)) {
        return faq.response;
      }
    }
  }

  // Default response
  return 'I\'m not sure I understand. Could you please rephrase your question? You can also create a support ticket if you need personalized assistance from our team.';
};

// Send a message to the chatbot
const sendMessage = (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Save user message
    const userMessageId = uuidv4();
    db.prepare(`
      INSERT INTO chat_messages (id, user_id, message, is_bot_response)
      VALUES (?, ?, ?, 0)
    `).run(userMessageId, userId, message);

    // Generate bot response
    const botResponse = findResponse(message);
    const botMessageId = uuidv4();
    db.prepare(`
      INSERT INTO chat_messages (id, user_id, message, is_bot_response)
      VALUES (?, ?, ?, 1)
    `).run(botMessageId, userId, botResponse);

    res.json({
      userMessage: {
        id: userMessageId,
        message,
        is_bot_response: false,
        created_at: new Date().toISOString()
      },
      botResponse: {
        id: botMessageId,
        message: botResponse,
        is_bot_response: true,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};

// Get chat history
const getChatHistory = (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const messages = db.prepare(`
      SELECT * FROM chat_messages
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(userId, parseInt(limit), parseInt(offset));

    // Reverse to get chronological order
    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
};

// Clear chat history
const clearChatHistory = (req, res) => {
  try {
    const userId = req.user.id;

    db.prepare('DELETE FROM chat_messages WHERE user_id = ?').run(userId);

    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
};

// FAQ Management (Admin only)
const getFAQs = (req, res) => {
  try {
    const faqs = db.prepare('SELECT * FROM faqs ORDER BY category, created_at').all();
    res.json({ faqs });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ error: 'Failed to get FAQs' });
  }
};

const createFAQ = (req, res) => {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO faqs (id, question, answer, category)
      VALUES (?, ?, ?, ?)
    `).run(id, question, answer, category);

    const faq = db.prepare('SELECT * FROM faqs WHERE id = ?').get(id);
    res.status(201).json({ message: 'FAQ created successfully', faq });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
};

const updateFAQ = (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category } = req.body;

    const faq = db.prepare('SELECT * FROM faqs WHERE id = ?').get(id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    db.prepare(`
      UPDATE faqs SET question = ?, answer = ?, category = ?
      WHERE id = ?
    `).run(question || faq.question, answer || faq.answer, category || faq.category, id);

    const updatedFAQ = db.prepare('SELECT * FROM faqs WHERE id = ?').get(id);
    res.json({ message: 'FAQ updated successfully', faq: updatedFAQ });
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
};

const deleteFAQ = (req, res) => {
  try {
    const { id } = req.params;

    const faq = db.prepare('SELECT * FROM faqs WHERE id = ?').get(id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    db.prepare('DELETE FROM faqs WHERE id = ?').run(id);
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  clearChatHistory,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
};
