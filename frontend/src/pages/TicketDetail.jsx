import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ticketService, userService } from '../services/api';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [agents, setAgents] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ticketService.getById(id);
        setTicket(response.data.ticket);
        setMessages(response.data.messages);

        if (user?.role === 'admin' || user?.role === 'agent') {
          const agentsRes = await userService.getAgents();
          setAgents(agentsRes.data.agents);
        }
      } catch (error) {
        console.error('Failed to fetch ticket:', error);
        navigate('/tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, user?.role]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await ticketService.addMessage(id, newMessage);
      setMessages([...messages, response.data.ticketMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleUpdateTicket = async (field, value) => {
    try {
      const response = await ticketService.update(id, { [field]: value });
      setTicket(response.data.ticket);
    } catch (error) {
      console.error('Failed to update ticket:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div>
      <div className="page-header">
        <h1>Ticket Details</h1>
        <button onClick={() => navigate('/tickets')} className="btn btn-secondary">
          ← Back to Tickets
        </button>
      </div>

      <div className="ticket-detail">
        <div className="ticket-main">
          <h2>{ticket.title}</h2>
          <p className="ticket-description">{ticket.description}</p>

          <div className="messages-section">
            <h3>Messages</h3>
            
            {messages.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No messages yet. Start the conversation!</p>
            ) : (
              <div className="message-list">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`message-item ${msg.sender_role === 'customer' ? 'user-message' : 'agent-message'}`}
                  >
                    <div className="message-header">
                      <span className="sender">{msg.sender_name} ({msg.sender_role})</span>
                      <span className="time">{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                    <div className="message-content">{msg.message}</div>
                  </div>
                ))}
              </div>
            )}

            {ticket.status !== 'closed' && (
              <form onSubmit={handleSendMessage} className="message-form">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <button type="submit" className="btn btn-primary">
                  Send
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="ticket-sidebar">
          <h3>Ticket Information</h3>
          
          <div className="sidebar-item">
            <label>Ticket ID</label>
            <div className="value">{ticket.id.slice(0, 8)}...</div>
          </div>

          <div className="sidebar-item">
            <label>Status</label>
            {user?.role === 'customer' ? (
              <div className="value">
                <span className={`status-badge ${ticket.status}`}>{ticket.status.replace('_', ' ')}</span>
              </div>
            ) : (
              <select 
                value={ticket.status} 
                onChange={(e) => handleUpdateTicket('status', e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            )}
          </div>

          <div className="sidebar-item">
            <label>Priority</label>
            {user?.role === 'customer' ? (
              <div className="value">
                <span className={`priority-badge ${ticket.priority}`}>{ticket.priority}</span>
              </div>
            ) : (
              <select 
                value={ticket.priority} 
                onChange={(e) => handleUpdateTicket('priority', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            )}
          </div>

          {(user?.role === 'admin' || user?.role === 'agent') && (
            <div className="sidebar-item">
              <label>Assigned To</label>
              <select 
                value={ticket.assigned_agent_id || ''} 
                onChange={(e) => handleUpdateTicket('assigned_agent_id', e.target.value || null)}
              >
                <option value="">Unassigned</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="sidebar-item">
            <label>Customer</label>
            <div className="value">{ticket.customer_name}</div>
          </div>

          <div className="sidebar-item">
            <label>Created</label>
            <div className="value">{new Date(ticket.created_at).toLocaleString()}</div>
          </div>

          <div className="sidebar-item">
            <label>Updated</label>
            <div className="value">{new Date(ticket.updated_at).toLocaleString()}</div>
          </div>

          {user?.role === 'customer' && ticket.status !== 'closed' && (
            <button 
              className="btn btn-danger" 
              style={{ width: '100%', marginTop: '20px' }}
              onClick={() => handleUpdateTicket('status', 'closed')}
            >
              Close Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
