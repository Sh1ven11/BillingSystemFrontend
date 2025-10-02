import React, { useState } from 'react';
import { useAuth } from '../components/Auth/authProvider'; // Use the hook
//import { authAPI } from '../services/api';

const Login = () => {
  const { login } = useAuth(); // Get the login function from context
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Check for empty fields
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }
    
    try {
      await login(credentials); // Call the login function from the context
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 w-50">
      <div className="card ps-3 pe-3">
        <div className="card-body">
          <h2 className="card-title text-center">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input 
                type="email" 
                className="form-control" 
                name="email" 
                value={credentials.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input 
                type="password" 
                className="form-control" 
                name="password" 
                value={credentials.password} 
                onChange={handleChange} 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;