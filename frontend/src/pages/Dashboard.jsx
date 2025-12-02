import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ticketService } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ticketsRes] = await Promise.all([
          ticketService.getStats(),
          ticketService.getAll({ limit: 5 })
        ]);
        setStats(statsRes.data.stats);
        setRecentTickets(ticketsRes.data.tickets);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <h1>Welcome, {user?.name}!</h1>
        <Link to="/tickets" className="btn btn-primary" style={{ padding: '10px 20px' }}>
          {user?.role === 'customer' ? 'Create New Ticket' : 'View All Tickets'}
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Tickets</div>
          <div className="value">{stats?.total || 0}</div>
        </div>
        <div className="stat-card open">
          <div className="label">Open</div>
          <div className="value">{stats?.open || 0}</div>
        </div>
        <div className="stat-card progress">
          <div className="label">In Progress</div>
          <div className="value">{stats?.in_progress || 0}</div>
        </div>
        <div className="stat-card resolved">
          <div className="label">Resolved</div>
          <div className="value">{stats?.resolved || 0}</div>
        </div>
        {(user?.role === 'admin' || user?.role === 'agent') && (
          <div className="stat-card urgent">
            <div className="label">Urgent</div>
            <div className="value">{stats?.urgent || 0}</div>
          </div>
        )}
      </div>

      <div className="tickets-container">
        <div className="tickets-header">
          <h2>Recent Tickets</h2>
          <Link to="/tickets" style={{ color: '#667eea', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>
        
        {recentTickets.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎫</div>
            <h3>No tickets yet</h3>
            <p>Create your first support ticket to get started</p>
          </div>
        ) : (
          <ul className="ticket-list">
            {recentTickets.map((ticket) => (
              <li key={ticket.id}>
                <Link to={`/tickets/${ticket.id}`} className="ticket-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="ticket-info">
                    <h3>{ticket.title}</h3>
                    <p>{ticket.customer_name || 'Customer'} • {new Date(ticket.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="ticket-meta">
                    <span className={`priority-badge ${ticket.priority}`}>{ticket.priority}</span>
                    <span className={`status-badge ${ticket.status}`}>{ticket.status.replace('_', ' ')}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
