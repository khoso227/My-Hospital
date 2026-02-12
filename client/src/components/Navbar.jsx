import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <nav className="navbar">
      <div style={{fontWeight:'bold', fontSize:'1.2rem', color:'#2563eb'}}>HOSPITAL OS</div>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/doctors">Doctors</Link>
        <button onClick={handleLogout} className="btn-primary" style={{marginLeft:'20px', background:'#ef4444'}}>Logout</button>
      </div>
    </nav>
  );
};
export default Navbar;