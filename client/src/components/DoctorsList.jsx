// client/src/components/DoctorsList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get('https://my-hospital-odec.vercel.app/api/doctors')
      .then(res => setDoctors(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Doctors List</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Specialty</th></tr>
        </thead>
        <tbody>
          {doctors.map(doc => (
            <tr key={doc._id}><td>{doc.name}</td><td>{doc.specialty}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsList;