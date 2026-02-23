import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MedicalStore = () => {
  const { t } = useTranslation();
  const [searchMed, setSearchMed] = useState("");

  // Medicine Inventory Mock Data
  const [inventory, setInventory] = useState([
    { id: 1, name: "Augmentin 625mg", category: "Antibiotic", price: 450, stock: 120, expiry: "2025-12" },
    { id: 2, name: "Panadol CF", category: "Painkiller", price: 20, stock: 500, expiry: "2026-06" },
    { id: 3, name: "Insulin Humalog", category: "Diabetes", price: 2800, stock: 15, expiry: "2025-08" },
    { id: 4, name: "Ventolin Inhaler", category: "Asthma", price: 350, stock: 45, expiry: "2026-01" },
  ]);

  // Billing Mock Data for Patients
  const [patientBills, setPatientBills] = useState([
    { id: 101, patient: "Zahid Mehar", caste: "Jatt", total: 5000, advance: 2000, remaining: 3000, status: "Admitted" },
    { id: 102, patient: "Ali Nawaz", caste: "Arain", total: 1500, advance: 1500, remaining: 0, status: "Discharged" },
  ]);

  const filteredMeds = inventory.filter(m => m.name.toLowerCase().includes(searchMed.toLowerCase()));

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">💊 Medical Store & Pharmacy</h1>
          <p className="text-gray-500">Manage medicine stock and patient billing details.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow">+ Add New Stock</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">Generate Bill</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Medicine Inventory */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Medicine Inventory</h3>
            <input 
              type="text" 
              placeholder="🔍 Search Medicine..." 
              className="border p-2 rounded-lg w-1/2 outline-blue-400"
              onChange={(e) => setSearchMed(e.target.value)}
            />
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="p-3">Medicine Name</th>
                <th className="p-3">Price (Rs.)</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Expiry</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredMeds.map(med => (
                <tr key={med.id} className="hover:bg-blue-50">
                  <td className="p-3">
                    <span className="font-bold">{med.name}</span> <br/>
                    <small className="text-blue-500">{med.category}</small>
                  </td>
                  <td className="p-3 font-semibold">Rs. {med.price}</td>
                  <td className={`p-3 font-bold ${med.stock < 20 ? 'text-red-500' : 'text-gray-700'}`}>
                    {med.stock}
                  </td>
                  <td className="p-3 text-sm">{med.expiry}</td>
                  <td className="p-3">
                    <button className="text-blue-600 font-bold">Sale</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Side: Quick Billing Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
          <h3 className="text-xl font-bold mb-4">💰 Patient Billing (Summary)</h3>
          <div className="space-y-4">
            {patientBills.map(bill => (
              <div key={bill.id} className="p-4 border rounded-xl bg-gray-50">
                <div className="flex justify-between border-b pb-2 mb-2">
                  <span className="font-bold text-gray-800">{bill.patient} ({bill.caste})</span>
                  <span className={`text-xs px-2 py-1 rounded ${bill.status === 'Admitted' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {bill.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 text-sm gap-2">
                  <p>Total Bill:</p> <p className="text-right font-bold">Rs. {bill.total}</p>
                  <p>Advance Paid:</p> <p className="text-right text-green-600 font-bold">Rs. {bill.advance}</p>
                  <p className="border-t pt-1">Remaining:</p> 
                  <p className="border-t pt-1 text-right text-red-600 font-bold text-lg">Rs. {bill.remaining}</p>
                </div>
                <button className="w-full mt-3 bg-blue-100 text-blue-700 py-1 rounded font-bold hover:bg-blue-700 hover:text-white transition">
                  Receive Payment
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MedicalStore;