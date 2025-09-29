import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { templatesAPI, companiesAPI } from '../services/api';
import { useParams } from 'react-router-dom';

const TemplateEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [formData, setFormData] = useState({ name: '', subject: '', body: '', mail:'' });
  const [loading, setLoading] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);

  useEffect(() => {
    fetchCompanies();
    if(id){
      const fetchTemplate = async () => {
        try {
          const res = await templatesAPI.getOne(id);
          setFormData({
            name: res.data.template.name,
            subject: res.data.template.subject,
            body: res.data.template.body,
            mail: res.data.template.to_mail,
            selected_columns: res.data.template.selected_columns || []
          });
          setSelectedCompanies(res.data.template.companies.map(c => c.company_id));
        } catch (err) {
          console.error(err);
        }
      };
      fetchTemplate();
    }
  }, [id]);

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
    if(id){
      await templatesAPI.update(id, { ...formData, company_ids: selectedCompanies,selectedColumns:formData.selected_columns });
      navigate('/dashboard');
    }else{
    try {
      await templatesAPI.create({ ...formData, company_ids: selectedCompanies,selectedColumns:formData.selected_columns });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          <textarea className="form-control" value={formData.body} placeholder='{{company_name}} for company name {{total_amount}} for total amount' onChange={e => setFormData({ ...formData, body: e.target.value })} rows={5} required></textarea>
        </div>
        <div className="mb-3">
        <label>Select Columns for Personalization</label>
        <div>
          {["company_name", "inv_no", "amount_unpaid","inv_date","bill_amount"].map(col => (
            <div key={col} className="form-check">
              <input 
                type="checkbox" 
                className="form-check-input" 
                checked={formData.selected_columns?.includes(col)} 
                onChange={() => {
                  setFormData(prev => ({
                    ...prev,
                    selected_columns: prev.selected_columns?.includes(col)
                      ? prev.selected_columns.filter(c => c !== col)
                      : [...(prev.selected_columns || []), col]
                  }));
                }}
              />
              <label className="form-check-label">{col}</label>
            </div>
          ))}
        </div>
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
