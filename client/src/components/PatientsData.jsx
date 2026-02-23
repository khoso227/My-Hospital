// client/src/components/PatientsData.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientsData = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/patients')
      .then(res => setPatients(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Patients Data</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Age</th><th>Status</th><th>Doctor</th></tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p._id}><td>{p.name}</td><td>{p.age}</td><td>{p.status}</td><td>{p.doctor?.name}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsData;