import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      window.location.href = '/dashboard'; // Page refresh ke saath redirect
    } catch (err) {
      alert("Invalid Credentials!");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Please enter your details to login</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" className="form-input" placeholder="admin@hospital.com"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" className="form-input" placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          <button type="submit" className="auth-btn">Sign In</button>
        </form>

        <p style={{textAlign:'center', marginTop:'20px', color:'#64748b'}}>
          Don't have an account? <Link to="/register" style={{color:'#4f46e5', fontWeight:'bold'}}>Register here</Link>
        </p>

        <div className="demo-box">
          <strong>Demo Access:</strong><br/>
          Admin: admin@hospital.com / password123
        </div>
      </div>
    </div>
  );
};

export default Login;