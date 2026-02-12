import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  // Jab bhi token update ho, state refresh karo
  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* Sidebar sirf login ke baad dikhega aur role ke mutabiq badlega */}
      {token && <Sidebar userRole={role} onLogout={handleLogout} />}
      
      <div className={token ? "main-content" : ""}>
        <Routes>
          {/* Public Routes: Agar login ho to in par mat jane do */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={token ? <Dashboard userRole={role} /> : <Navigate to="/login" />} />
          <Route path="/patients" element={token ? <h1>Patient Management</h1> : <Navigate to="/login" />} />
          <Route path="/doctors" element={token ? <h1>Doctor Management</h1> : <Navigate to="/login" />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;