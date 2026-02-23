// client/src/components/Billing.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Billing = () => {
  const [billings, setBillings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/billing')
      .then(res => setBillings(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Billing List</h2>
      <table>
        <thead>
          <tr><th>Patient</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody>
          {billings.map(b => (
            <tr key={b._id}><td>{b.patient.name}</td><td>{b.amount}</td><td>{b.status}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Billing;