import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/tickets', label: 'Tickets', icon: '🎫' },
    { path: '/chat', label: 'AI Assistant', icon: '🤖' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>💬</span>
          <h2>SmartSupport</h2>
        </div>
        
        <nav>
          <ul className="sidebar-nav">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-user">
          <p>{user?.name}</p>
          <span className="role">{user?.role}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
