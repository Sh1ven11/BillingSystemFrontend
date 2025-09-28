import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { templatesAPI, companiesAPI } from '../services/api';

const TemplateEditor = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [formData, setFormData] = useState({ name: '', subject: '', body: '', mail:'' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await companiesAPI.getAll();
      const mapped = res.data.companies_with_unpaid_bills.map(c => ({ company_id: c.id, company_name: c.name }));
      setCompanies(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("hi from here");
    setLoading(true);
    try {
      await templatesAPI.create({ ...formData, company_ids: selectedCompanies });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompany = (id) => {
    setSelectedCompanies(prev => prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedCompanies.length === companies.length) setSelectedCompanies([]);
    else setSelectedCompanies(companies.map(c => c.company_id));
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Template Name</label>
          <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
        </div>
         <div className="mb-3">
          <label>Send To Mail</label>
          <input type="text" className="form-control" value={formData.mail} onChange={e => setFormData({ ...formData, mail: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label>Subject</label>
          <input type="text" className="form-control" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required />
        </div>
        <div className="mb-3">
          <label>Body</label>
          <textarea className="form-control" value={formData.body} onChange={e => setFormData({ ...formData, body: e.target.value })} rows={5} required></textarea>
        </div>
        <div className="mb-3">
          <label>Companies</label>
          <button type="button" className="btn btn-sm btn-link" onClick={selectAll}>{selectedCompanies.length === companies.length ? 'Deselect All' : 'Select All'}</button>
          <div>
            {companies.map(c => (
              <div key={c.company_id} className="form-check">
                <input type="checkbox" className="form-check-input" checked={selectedCompanies.includes(c.company_id)} onChange={() => toggleCompany(c.company_id)} />
                <label className="form-check-label">{c.company_name}</label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Template'}</button>
      </form>
    </div>
  );
};

export default TemplateEditor;
