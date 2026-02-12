import React from 'react';

const Dashboard = ({ userRole }) => {
  return (
    <div className="dashboard-view">
      <header>
        <h1>{userRole === 'super-admin' ? 'Master Control Panel' : 'Hospital Dashboard'}</h1>
        <p>Logged in as: <span style={{color:'#4f46e5', fontWeight:'bold'}}>{userRole}</span></p>
      </header>

      <div className="stats-grid">
        {/* SIRF Super Admin ko dikhega */}
        {userRole === 'super-admin' && (
          <>
            <div className="stat-card" style={{borderBottomColor:'#8b5cf6'}}>
              <h3>Global Hospitals</h3>
              <p>12 Active Clients</p>
            </div>
            <div className="stat-card" style={{borderBottomColor:'#10b981'}}>
              <h3>Platform Revenue</h3>
              <p>PKR 1,500,000</p>
            </div>
          </>
        )}

        {/* Admin aur Doctor dono ko dikhega */}
        {(userRole === 'admin' || userRole === 'doctor') && (
          <>
            <div className="stat-card">
              <h3>Today's Appointments</h3>
              <p>24 Patients</p>
            </div>
            <div className="stat-card" style={{borderBottomColor:'#f59e0b'}}>
              <h3>Active Doctors</h3>
              <p>8 On Duty</p>
            </div>
          </>
        )}

        {/* SIRF Doctor ko dikhega */}
        {userRole === 'doctor' && (
          <div className="stat-card" style={{borderBottomColor:'#ec4899'}}>
            <h3>Your Pending Reports</h3>
            <p>5 New</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;