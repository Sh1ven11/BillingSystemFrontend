import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { billsAPI, templatesAPI, authAPI } from '../services/api';
import { useAuth } from '../components/Auth/authProvider';

const Dashboard = () => {
  const { logout } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unpaidData, setUnpaidData] = useState({ companies: [], totalAmount: 0, totalCount: 0 });
  const [expandedCompanies, setExpandedCompanies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [templatesRes, billsRes] = await Promise.all([
          templatesAPI.getAll(),
          billsAPI.getUnpaidGrouped()
        ]);

        setTemplates(templatesRes.data.templates || []);
        const companies = billsRes.data.companies_with_unpaid_bills ;
        setUnpaidData({ companies: companies || [], totalAmount: billsRes.data.total_unpaid_amount || 0, totalCount: billsRes.data.total_unpaid_bills|| 0 });
        //setUnpaidData(companies:billsRes.data.unpaidData || { companies: [], totalAmount: 0, totalCount: 0 });
        setError(null);
      } catch (err) {
        console.error('Dashboard data load error:', err);
        setError('Failed to load dashboard data.');
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [logout]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout API call failed:', err);
    }
    logout();
  };

  const toggleCompany = (id) => {
    setExpandedCompanies(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };
  const handleSendMail = async (templateId, templateName) => {
    try {
      await templatesAPI.sendMail(templateId);
      alert('Email sent successfully.');
    } catch (err) {
      console.error('Send mail error:', err);
      alert('Failed to send email.');
    }
  };


  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between">
          <h5>Templates</h5>
          <Link to="/templates/new" className="btn btn-primary btn-sm">
            Create New Template
          </Link>
        </div>
        <div className="card-body">
          {templates && templates.length > 0 ? (
            <div className="list-group">
              {templates.map(t => (
                <div key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{t.name}</h6>
                    <p className="mb-1">{t.subject}</p>
                  </div>
                  <div>
                    <Link to={`/templates/new/${t.id}`} className="btn btn-sm btn-outline-secondary me-2">Edit</Link>
                    <button className="btn btn-sm btn-success" onClick={() => handleSendMail(t.id, t.name)}>Mail</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No templates found.</div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>Unpaid Bills</h5>
          <span>Total Bills: {unpaidData.totalCount}</span>
          <span className="ms-2">Total Amount: ₹{unpaidData.totalAmount}</span>
        </div>
        <div className="card-body">
          {unpaidData.companies && unpaidData.companies.length > 0 ? (
            unpaidData.companies.map(c => (
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
            ))
          ) : (
            <div>No unpaid bills found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;