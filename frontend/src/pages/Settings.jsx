import React from 'react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="tickets-container" style={{ padding: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Profile Information</h2>
        
        <div style={{ display: 'grid', gap: '20px', maxWidth: '500px' }}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={user?.name || ''} disabled />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={user?.email || ''} disabled />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input type="text" value={user?.role || ''} disabled style={{ textTransform: 'capitalize' }} />
          </div>
        </div>

        <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '10px' }}>About SmartSupport</h3>
          <p style={{ color: '#666' }}>
            SmartSupport is a unified customer service platform that enables businesses to manage 
            customer support tickets efficiently while offering instant assistance through an AI chatbot.
          </p>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
