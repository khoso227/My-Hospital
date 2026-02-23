import React, { useState } from 'react';

const Patients = () => {
  // Fake Data (Mock Data)
  const [patients, setPatients] = useState([
    { id: 1, name: "Ali Ahmed", age: 45, gender: "Male", contact: "0300-1234567", status: "Admitted" },
    { id: 2, name: "Sana Khan", age: 28, gender: "Female", contact: "0312-9876543", status: "Recovered" },
    { id: 3, name: "Zubair Shaikh", age: 35, gender: "Male", contact: "0345-1122334", status: "Outpatient" },
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Patient Directory</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition shadow-md">
          + Add New Patient
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 text-left text-sm uppercase font-semibold">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Age/Gender</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{p.name}</td>
                <td className="px-6 py-4 text-gray-600">{p.age} yrs / {p.gender}</td>
                <td className="px-6 py-4 text-gray-600">{p.contact}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    p.status === 'Admitted' ? 'bg-red-100 text-red-700' : 
                    p.status === 'Recovered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-indigo-600 hover:text-indigo-900 font-semibold mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;