import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Beaker, Plus, X } from 'lucide-react';

const LabsTab = () => {
    const [labs, setLabs] = useState([]);
    const [patients, setPatients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ patient: '', testName: '', fee: '', status: 'Pending' });

    const fetchData = async () => {
        try {
            const resL = await axios.get('https://my-hospital-odec.vercel.app/api/labs');
            const resP = await axios.get('https://my-hospital-odec.vercel.app/api/patients');
            if (resL.data.success) setLabs(resL.data.data);
            if (resP.data.success) setPatients(resP.data.data);
        } catch (err) { console.log(err); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://my-hospital-odec.vercel.app/api/labs/add', formData);
            if (res.data.success) {
                setIsModalOpen(false);
                setFormData({ patient: '', testName: '', fee: '', status: 'Pending' });
                fetchData();
            }
        } catch (err) { alert("Error saving test"); }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm mb-6 border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-teal-50 rounded-2xl text-teal-600">
                        <Beaker size={32} />
                    </div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-800">Laboratory Hub</h1>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-black shadow-lg shadow-blue-200 hover:scale-105 transition-all"
                >
                    <Plus size={24} /> NEW TEST
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400">
                        <tr>
                            <th className="p-6">Patient</th>
                            <th className="p-6">Test</th>
                            <th className="p-6">Fee</th>
                            <th className="p-6 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labs.map(lab => (
                            <tr key={lab._id} className="border-t hover:bg-gray-50 transition-colors">
                                <td className="p-6 font-bold text-gray-800">{lab.patient?.name}</td>
                                <td className="p-6 text-gray-600">{lab.testName}</td>
                                <td className="p-6 font-black text-green-600">Rs. {lab.fee}</td>
                                <td className="p-6 text-center">
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-bold ${lab.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {lab.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add New Test Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black italic">Book Lab Test</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black"><X/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <select 
                                className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-blue-500"
                                required
                                value={formData.patient}
                                onChange={e => setFormData({...formData, patient: e.target.value})}
                            >
                                <option value="">Select Patient</option>
                                {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                            
                            <input 
                                placeholder="Test Name (e.g. Blood CP)" 
                                className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-blue-500" 
                                required
                                onChange={e => setFormData({...formData, testName: e.target.value})}
                            />
                            
                            <input 
                                type="number" 
                                placeholder="Fee Amount" 
                                className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-blue-500" 
                                required
                                onChange={e => setFormData({...formData, fee: e.target.value})}
                            />

                            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-100 mt-4">
                                SAVE LAB RECORD
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabsTab;