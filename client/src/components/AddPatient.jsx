// src/components/AddPatient.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPatient = () => {
  const navigate = useNavigate();

  const doctors = [
    { id: 1, name: "Dr. Gm Khoso", specialist: "Neurologist" },
    { id: 2, name: "Dr. Ahmed Ali", specialist: "Cardiologist" },
    { id: 3, name: "Dr. Sara Khan", specialist: "General Physician" }
  ];

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contact: '',
    disease: '',
    selectedDoctor: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Patient Data:", formData);
    alert(`Success! Patient ${formData.name} registered with ${formData.selectedDoctor}`);
    navigate('/patients');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="max-w-2xl w-full bg-white p-10 rounded-[40px] shadow-2xl border border-blue-50">
        <h2 className="text-3xl font-black text-blue-800 mb-6 uppercase tracking-tighter">Register New Patient</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 border rounded-xl" required />
          <input type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full p-4 border rounded-xl" required />
          <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-4 border rounded-xl">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input type="text" placeholder="Contact Number" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full p-4 border rounded-xl" required />
          <select value={formData.selectedDoctor} onChange={e => setFormData({...formData, selectedDoctor: e.target.value})} className="w-full p-4 border rounded-xl" required>
            <option value="">-- Select Doctor --</option>
            {doctors.map(doc => <option key={doc.id} value={doc.name}>{doc.name} ({doc.specialist})</option>)}
          </select>
          <textarea placeholder="Symptoms / Reason" value={formData.disease} onChange={e => setFormData({...formData, disease: e.target.value})} className="w-full p-4 border rounded-xl" rows="4" />
          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700">
            Save Patient ✅
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;