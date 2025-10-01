import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = ({ onLogin }) => {
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

    try {
      // 1. Login first
      const loginResponse = await authAPI.login(credentials);
      console.log('Login response:', loginResponse.data);

      // 2. Immediately test the session
      const sessionResponse = await authAPI.checkAuth();
      console.log('Session check after login:', sessionResponse.data);

      // 3. Also call debug-session to see everything
      try {
        const debugResponse = await fetch('https://billingsystembackend-xinn.onrender.com/api/debug-session', {
          credentials: 'include' // Important for cookies
        });
        const debugData = await debugResponse.json();
        console.log('Debug session:', debugData);
      } catch (debugError) {
        console.error('Debug session failed:', debugError);
      }

      onLogin();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      console.error('Login error:', err);
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