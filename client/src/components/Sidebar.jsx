const Sidebar = ({ userRole, onLogout }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">HOSPITAL OS</div>
      <div className="sidebar-menu">
        <Link to="/dashboard" className="menu-item">🏠 Dashboard</Link>
        
        {userRole === 'super-admin' ? (
          <Link to="/hospitals" className="menu-item">🏢 All Hospitals</Link>
        ) : (
          <>
            <Link to="/patients" className="menu-item">👥 Patients</Link>
            <Link to="/doctors" className="menu-item">🩺 Doctors</Link>
          </>
        )}
      </div>
      <button onClick={onLogout} className="logout-btn">Logout</button>
    </div>
  );
};