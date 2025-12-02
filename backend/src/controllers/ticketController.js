const { v4: uuidv4 } = require('uuid');
const db = require('../database');

// Create a new ticket
const createTicket = (req, res) => {
  try {
    const { title, description, priority = 'medium' } = req.body;
    const customerId = req.user.id;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO tickets (id, title, description, priority, customer_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, title, description, priority, customerId);

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
    res.status(201).json({ message: 'Ticket created successfully', ticket });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};

// Get all tickets (with filters)
const getTickets = (req, res) => {
  try {
    const { status, priority, assigned_to, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT t.*, 
             c.name as customer_name, 
             c.email as customer_email,
             a.name as agent_name
      FROM tickets t
      LEFT JOIN users c ON t.customer_id = c.id
      LEFT JOIN users a ON t.assigned_agent_id = a.id
      WHERE 1=1
    `;
    const params = [];

    // If customer, only show their tickets
    if (req.user.role === 'customer') {
      query += ' AND t.customer_id = ?';
      params.push(req.user.id);
    }

    // If agent, show assigned tickets
    if (req.user.role === 'agent' && !assigned_to) {
      query += ' AND (t.assigned_agent_id = ? OR t.assigned_agent_id IS NULL)';
      params.push(req.user.id);
    }

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }

    if (assigned_to) {
      query += ' AND t.assigned_agent_id = ?';
      params.push(assigned_to);
    }

    query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const tickets = db.prepare(query).all(...params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM tickets WHERE 1=1';
    const countParams = [];
    
    if (req.user.role === 'customer') {
      countQuery += ' AND customer_id = ?';
      countParams.push(req.user.id);
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Failed to get tickets' });
  }
};

// Get a single ticket
const getTicket = (req, res) => {
  try {
    const { id } = req.params;

    const ticket = db.prepare(`
      SELECT t.*, 
             c.name as customer_name, 
             c.email as customer_email,
             a.name as agent_name
      FROM tickets t
      LEFT JOIN users c ON t.customer_id = c.id
      LEFT JOIN users a ON t.assigned_agent_id = a.id
      WHERE t.id = ?
    `).get(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check access rights
    if (req.user.role === 'customer' && ticket.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get ticket messages
    const messages = db.prepare(`
      SELECT m.*, u.name as sender_name, u.role as sender_role
      FROM ticket_messages m
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.ticket_id = ?
      ORDER BY m.created_at ASC
    `).all(id);

    res.json({ ticket, messages });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Failed to get ticket' });
  }
};

// Update ticket
const updateTicket = (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assigned_agent_id } = req.body;

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check access rights
    if (req.user.role === 'customer' && ticket.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Customers can only update status to 'closed'
    if (req.user.role === 'customer' && status && status !== 'closed') {
      return res.status(403).json({ error: 'Customers can only close tickets' });
    }

    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    if (priority && req.user.role !== 'customer') {
      updates.push('priority = ?');
      params.push(priority);
    }

    if (assigned_agent_id !== undefined && req.user.role !== 'customer') {
      updates.push('assigned_agent_id = ?');
      params.push(assigned_agent_id);
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id);

      db.prepare(`UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const updatedTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
    res.json({ message: 'Ticket updated successfully', ticket: updatedTicket });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
};

// Add message to ticket
const addMessage = (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const senderId = req.user.id;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check access rights
    if (req.user.role === 'customer' && ticket.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messageId = uuidv4();
    db.prepare(`
      INSERT INTO ticket_messages (id, ticket_id, sender_id, message)
      VALUES (?, ?, ?, ?)
    `).run(messageId, id, senderId, message);

    // Update ticket status to in_progress if agent responds
    if (req.user.role !== 'customer' && ticket.status === 'open') {
      db.prepare(`
        UPDATE tickets SET status = 'in_progress', updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).run(id);
    }

    const newMessage = db.prepare(`
      SELECT m.*, u.name as sender_name, u.role as sender_role
      FROM ticket_messages m
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `).get(messageId);

    res.status(201).json({ message: 'Message added successfully', ticketMessage: newMessage });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
};

// Get ticket statistics (for dashboard)
const getStats = (req, res) => {
  try {
    let whereClause = '1=1';
    const params = [];

    if (req.user.role === 'customer') {
      whereClause += ' AND customer_id = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'agent') {
      whereClause += ' AND (assigned_agent_id = ? OR assigned_agent_id IS NULL)';
      params.push(req.user.id);
    }

    // Use a single query with CASE statements to get all counts at once
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed,
        SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent
      FROM tickets
      WHERE ${whereClause}
    `;

    const result = db.prepare(query).get(...params);

    const stats = {
      total: result.total || 0,
      open: result.open || 0,
      in_progress: result.in_progress || 0,
      resolved: result.resolved || 0,
      closed: result.closed || 0,
      urgent: result.urgent || 0
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  addMessage,
  getStats
};
