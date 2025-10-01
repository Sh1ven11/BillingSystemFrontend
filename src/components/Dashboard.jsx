import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Dashboard = ({ onLogout }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unpaidData, setUnpaidData] = useState({ companies: [], totalAmount: 0, totalCount: 0 });
  const [expandedCompanies, setExpandedCompanies] = useState([]);
  const [sessionInfo, setSessionInfo] = useState('');

  useEffect(() => {
    checkSessionAndLoadData();
  }, []);

  const checkSessionAndLoadData = async () => {
    try {
      // First, check what the session looks like
      const debugResponse = await fetch('https://billingsystembackend-xinn.onrender.com/api/debug-session', {
        credentials: 'include'
      });
      const debugData = await debugResponse.json();
      console.log('Dashboard session debug:', debugData);
      
      setSessionInfo(`Session: ${debugData.isAuthenticated ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}`);

      if (!debugData.isAuthenticated) {
        console.error('Session not authenticated in dashboard');
        return;
      }

      // Load mock data since we don't have other APIs
      setTemplates([
        { id: 1, name: 'Invoice Template', subject: 'Monthly Invoice' },
        { id: 2, name: 'Payment Reminder', subject: 'Urgent Payment Required' }
      ]);
      
      setUnpaidData({
        companies: [
          { 
            id: 1, 
            name: 'Demo Company', 
            bills: [
              { id: 1, inv_no: 'INV-001', amount_unpaid: 5000 },
              { id: 2, inv_no: 'INV-002', amount_unpaid: 3000 }
            ]
          }
        ],
        totalAmount: 8000,
        totalCount: 2
      });

    } catch (err) {
      console.error('Dashboard error:', err);
      setSessionInfo('Error checking session');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    if (onLogout && typeof onLogout === 'function') {
      onLogout();
    }
  };

  const toggleCompany = (id) => {
    setExpandedCompanies(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleSendMail = (templateId, templateName) => {
    alert(`Would send mail for: ${templateName}`);
  };

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Session Debug Info */}
      {sessionInfo && (
        <div className={`alert ${sessionInfo.includes('AUTHENTICATED') ? 'alert-success' : 'alert-warning'}`}>
          {sessionInfo}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between">
          <h5>Templates</h5>
          <Link to="/templates/new" className="btn btn-primary btn-sm">
            Create New Template
          </Link>
        </div>
        <div className="card-body">
          <div className="list-group">
            {templates.map(t => (
              <div key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{t.name}</h6>
                  <p className="mb-1">{t.subject}</p>
                </div>
                <div>
                  <Link to={`/templates/new/${t.id}`} className="btn btn-sm btn-outline-secondary me-2">
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleSendMail(t.id, t.name)}
                  >
                    Mail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>Unpaid Bills</h5>
          <span>Total Bills: {unpaidData.totalCount}</span>
          <span className="ms-2">Total Amount: ₹{unpaidData.totalAmount}</span>
        </div>
        <div className="card-body">
          {unpaidData.companies.map(c => (
            <div key={c.id} className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <h6>{c.name} ({c.bills.length} bills)</h6>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => toggleCompany(c.id)}
                >
                  {expandedCompanies.includes(c.id) ? "Hide Bills" : "Show Bills"}
                </button>
              </div>
              {expandedCompanies.includes(c.id) && (
                <ul className="mt-2">
                  {c.bills.map(b => (
                    <li key={b.id}>{b.inv_no} - ₹{b.amount_unpaid}</li>
                  ))}
                </ul>
              )}
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;