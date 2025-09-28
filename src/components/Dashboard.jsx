import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { templatesAPI, billsAPI, authAPI } from '../services/api';

const Dashboard = ({ onLogout }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unpaidData, setUnpaidData] = useState({ companies: [], totalAmount: 0, totalCount: 0 });
  const [expandedCompanies, setExpandedCompanies] = useState([]); // track expanded companies

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [templatesRes, billsRes] = await Promise.all([
        templatesAPI.getAll(),
        billsAPI.getUnpaidGrouped(),
      ]);
      setTemplates(templatesRes.data.templates);
      const companies = billsRes.data.companies_with_unpaid_bills;
      setUnpaidData({
        companies,
        totalAmount: billsRes.data.total_unpaid_amount,
        totalCount: billsRes.data.total_unpaid_bills,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authAPI.logout();
    onLogout();
  };

  // toggle dropdown
  const toggleCompany = (id) => {
    setExpandedCompanies(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
        <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Dashboard</h1>
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          </div>
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between">
            <h5>Templates</h5>
            <Link to="/templates/new" className="btn btn-primary btn-sm">Create New Template</Link>
          </div>
        <div className="card-body">
          {templates.length === 0 ? <p>No templates yet</p> : (
            <div className="list-group">
              {templates.map(t => (
                <div key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{t.name}</h6>
                    <p className="mb-1">{t.subject}</p>
                  </div>
                  <div>
                    {/* Edit Template */}
                    <Link to={`/templates/new/${t.id}`} className="btn btn-sm btn-outline-secondary me-2">
                      Edit
                    </Link>

                    {/* Mail Template */}
                    <button
                      className="btn btn-sm btn-success"
                      onClick={async () => {
                        try {
                          await templatesAPI.sendMail(t.id); // <-- you’ll add this API function
                          alert(`Mail sent for template "${t.name}"`);
                        } catch (err) {
                          console.error(err);
                          alert("Failed to send mail");
                        }
                      }}
                    >
                      Mail
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
