import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './components/Auth/authProvider';
import AuthProvider from './components/Auth/authProvider';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TemplateEditor from './components/TemplateEditor';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, token } = useAuth();
  return user && token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth(); // <-- Get loading state
  
  // Display a loading screen while the auth status is being checked
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? <Navigate to="/dashboard" /> : <Login />
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/templates/new/:id"
        element={
          <PrivateRoute>
            <TemplateEditor />
          </PrivateRoute>
        }
      />
      <Route
        path="/templates/new"
        element={
          <PrivateRoute>
            <TemplateEditor />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;