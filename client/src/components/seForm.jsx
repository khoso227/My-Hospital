// client/src/components/DispenseForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const DispenseForm = ({ medicines, patients }) => { // Assume props se lists aaye
  const [formData, setFormData] = useState({ medicineId: '', patientId: '', quantity: 1, notes: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://my-hospital-odec.vercel.app/api/pharmacy/dispense', formData);
      alert('Dispensed successfully! Bill generated.');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="medicineId" onChange={handleChange}>
        <option value="">Select Medicine</option>
        {medicines.map(m => <option key={m._id} value={m._id}>{m.medicineName}</option>)}
      </select>
      <select name="patientId" onChange={handleChange}>
        <option value="">Select Patient</option>
        {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
      </select>
      <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" />
      <textarea name="notes" onChange={handleChange} placeholder="Notes" />
      <button type="submit">Dispense</button>
    </form>
  );
};

export default DispenseForm;