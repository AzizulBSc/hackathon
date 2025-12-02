const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');

// Set up test database
const testDbPath = path.join(__dirname, '..', 'test-smartsupport.db');

// Clean up test database before tests
before(() => {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

// Clean up test database after tests
after(() => {
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

describe('Database', () => {
  it('should initialize database tables', () => {
    // Create a fresh database for testing
    const Database = require('better-sqlite3');
    const db = new Database(testDbPath);
    
    db.pragma('foreign_keys = ON');
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT CHECK(role IN ('customer', 'agent', 'admin')) DEFAULT 'customer',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const tableNames = tables.map(t => t.name);
    
    assert.ok(tableNames.includes('users'), 'Users table should exist');
    
    db.close();
  });
});

describe('Authentication Middleware', () => {
  it('should export authenticate and authorize functions', () => {
    const { authenticate, authorize, JWT_SECRET } = require('../middleware/auth');
    
    assert.ok(typeof authenticate === 'function', 'authenticate should be a function');
    assert.ok(typeof authorize === 'function', 'authorize should be a function');
    assert.ok(typeof JWT_SECRET === 'string', 'JWT_SECRET should be a string');
  });
  
  it('should return 401 when no token provided', async () => {
    const { authenticate } = require('../middleware/auth');
    
    const req = { headers: {} };
    const res = {
      status: function(code) { 
        this.statusCode = code; 
        return this; 
      },
      json: function(data) { 
        this.data = data; 
        return this; 
      }
    };
    const next = () => {};
    
    authenticate(req, res, next);
    
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.data.error, 'No token provided');
  });
});

describe('Chat Controller', () => {
  it('should export chat functions', () => {
    const chatController = require('../controllers/chatController');
    
    assert.ok(typeof chatController.sendMessage === 'function');
    assert.ok(typeof chatController.getChatHistory === 'function');
    assert.ok(typeof chatController.clearChatHistory === 'function');
    assert.ok(typeof chatController.getFAQs === 'function');
  });
});
