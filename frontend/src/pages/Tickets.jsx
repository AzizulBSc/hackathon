import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ticketService } from '../services/api';

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });

  const fetchTickets = async () => {
    try {
      const params = { ...filters, page: pagination.page };
      const response = await ticketService.getAll(params);
      setTickets(response.data.tickets);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters, pagination.page]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await ticketService.create(newTicket);
      setShowModal(false);
      setNewTicket({ title: '', description: '', priority: 'medium' });
      fetchTickets();
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPagination({ ...pagination, page: 1 });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>{user?.role === 'customer' ? 'My Tickets' : 'All Tickets'}</h1>
        {user?.role === 'customer' && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Create New Ticket
          </button>
        )}
      </div>

      <div className="tickets-container">
        <div className="tickets-header">
          <h2>Tickets</h2>
          <div className="filters">
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select name="priority" value={filters.priority} onChange={handleFilterChange}>
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎫</div>
            <h3>No tickets found</h3>
            <p>{user?.role === 'customer' ? 'Create your first support ticket' : 'No tickets match your filters'}</p>
          </div>
        ) : (
          <>
            <ul className="ticket-list">
              {tickets.map((ticket) => (
                <li key={ticket.id}>
                  <Link to={`/tickets/${ticket.id}`} className="ticket-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="ticket-info">
                      <h3>{ticket.title}</h3>
                      <p>
                        {user?.role !== 'customer' && `${ticket.customer_name || 'Customer'} • `}
                        {new Date(ticket.created_at).toLocaleDateString()}
                        {ticket.agent_name && ` • Assigned to ${ticket.agent_name}`}
                      </p>
                    </div>
                    <div className="ticket-meta">
                      <span className={`priority-badge ${ticket.priority}`}>{ticket.priority}</span>
                      <span className={`status-badge ${ticket.status}`}>{ticket.status.replace('_', ' ')}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            
            {pagination.pages > 1 && (
              <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button 
                  className="btn btn-secondary" 
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                >
                  Previous
                </button>
                <span style={{ padding: '8px 16px' }}>
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button 
                  className="btn btn-secondary" 
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Ticket</h2>
            <form onSubmit={handleCreateTicket}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Provide details about your issue..."
                  rows={5}
                  required
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
