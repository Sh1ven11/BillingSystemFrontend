import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TemplateEditor from './components/TemplateEditor';
import { authAPI } from './services/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.checkAuth();
      setIsAuthenticated(response.data.authenticated);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard onLogout={() => setIsAuthenticated(false)} /> : <Navigate to="/login" />}
        />
        <Route
          path="/templates/new/:id"
          element={isAuthenticated ? <TemplateEditor /> : <Navigate to="/login" />}
        />
        <Route
          path="/templates/new"
          element={isAuthenticated ? <TemplateEditor /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
