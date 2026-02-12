import React, { useState } from 'react';

const Patients = () => {
  const [patients] = useState([
    { id: 1, name: "Ali Ahmed", disease: "Fever", doctor: "Dr. Sarang", status: "Admitted" }
  ]);

  return (
    <div style={{padding: '30px'}}>
      <h2>Patient Records</h2>
      <button className="btn-primary" style={{marginBottom:'20px'}}>+ Add New Patient</button>
      <table className="table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Disease</th>
            <th>Assigned Doctor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.disease}</td>
              <td>{p.doctor}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Patients;