import React, { useState } from 'react';

const SuperAdminDashboard = () => {
  const [hospitals, setHospitals] = useState([
    { id: 1, name: "City Hospital", admin: "admin@city.com", status: "Active" }
  ]);

  return (
    <div style={{padding: '30px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Super Admin Master Control</h2>
        <button className="btn-primary">+ Register New Hospital</button>
      </div>
      
      <table className="table" style={{marginTop:'20px'}}>
        <thead>
          <tr style={{background:'#f1f5f9'}}>
            <th>Hospital ID</th>
            <th>Client Name</th>
            <th>Admin Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map(h => (
            <tr key={h.id}>
              <td>HOSP-00{h.id}</td>
              <td>{h.name}</td>
              <td>{h.admin}</td>
              <td><span style={{color:'green'}}>● {h.status}</span></td>
              <td><button>Settings</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default SuperAdminDashboard;