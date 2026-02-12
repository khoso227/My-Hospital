import React, { useState } from 'react';

const Doctors = ({ userRole }) => {
  const [doctors, setDoctors] = useState([
    { id: 1, name: "Dr. Sarang", specialty: "Cardiologist", status: "Active" }
  ]);

  return (
    <div className="main-content">
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px'}}>
        <h2>Doctor Management</h2>
        {userRole === 'admin' && <button className="btn-action">+ Add New Doctor</button>}
      </div>

      <div className="stats-grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}>
        {doctors.map(doc => (
          <div key={doc.id} className="stat-card">
            <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
              <div style={{width:'50px', height:'50px', background:'#e0e7ff', borderRadius:'50%', display:'flex', justifyContent:'center', alignItems:'center', fontSize:'20px'}}>👨‍⚕️</div>
              <div>
                <h4 style={{margin:0}}>{doc.name}</h4>
                <p style={{margin:0, color:'#64748b', fontSize:'14px'}}>{doc.specialty}</p>
              </div>
            </div>
            <hr style={{margin:'15px 0', opacity:'0.1'}}/>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'14px'}}>
              <span>Status: <strong style={{color:'green'}}>{doc.status}</strong></span>
              <button style={{border:'none', background:'none', color:'#4f46e5', cursor:'pointer', fontWeight:'bold'}}>View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;