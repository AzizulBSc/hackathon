const db = require('../database');

const getAgents = (req, res) => {
  try {
    const agents = db.prepare(`
      SELECT id, email, name, role, created_at 
      FROM users 
      WHERE role IN ('agent', 'admin')
    `).all();
    
    res.json({ agents });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ error: 'Failed to get agents' });
  }
};

const getAllUsers = (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, email, name, role, created_at 
      FROM users
    `).all();
    
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

const updateUserRole = (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['customer', 'agent', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);

    const updatedUser = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(id);
    res.json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

module.exports = { getAgents, getAllUsers, updateUserRole };
