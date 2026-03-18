import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Edit, Trash2, X } from 'lucide-react';

const DoctorsTab = () => {
    const [doctors, setDoctors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', degree: '', specialist: '', cell: '', timings: '', availableDays: '', extra1: '', extra2: ''
    });

    const cacheKey = 'doctors_offline';
    const persistLocal = (list) => localStorage.setItem(cacheKey, JSON.stringify(list));

    const fetchDoctors = async () => {
        try {
            const res = await axios.get('https://my-hospital-odec.vercel.app/api/doctors');
            if (res.data?.success) {
                setDoctors(res.data.data);
                persistLocal(res.data.data);
                return;
            }
        } catch (err) {
            console.log('Doctor API down, using cache:', err?.message);
        }
        const cached = localStorage.getItem(cacheKey);
        if (cached) setDoctors(JSON.parse(cached));
    };

    useEffect(() => { fetchDoctors(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData };
        try {
            if (editId) {
                await axios.put(`https://my-hospital-odec.vercel.app/api/doctors/${editId}`, payload);
            } else {
                await axios.post('https://my-hospital-odec.vercel.app/api/doctors/add', payload);
            }
            fetchDoctors();
        } catch (err) {
            // Offline/local fallback
            const id = editId || Date.now().toString();
            const updated = editId
                ? doctors.map(d => (d._id || d.id) === editId ? { ...d, ...payload, _id: d._id || d.id } : d)
                : [{ ...payload, _id: id }, ...doctors];
            setDoctors(updated);
            persistLocal(updated);
        }
        setIsModalOpen(false);
        setEditId(null);
        setFormData({ name: '', degree: '', specialist: '', cell: '', timings: '', availableDays: '', extra1: '', extra2: '' });
    };

    const handleEdit = (dr) => {
        setEditId(dr._id || dr.id);
        setFormData({
            name: dr.name || '',
            degree: dr.degree || '',
            specialist: dr.specialist || '',
            cell: dr.cell || '',
            timings: dr.timings || '',
            availableDays: dr.availableDays || '',
            extra1: dr.extra1 || '',
            extra2: dr.extra2 || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this doctor?')) return;
        try {
            await axios.delete(`https://my-hospital-odec.vercel.app/api/doctors/${id}`);
            fetchDoctors();
        } catch (err) {
            const updated = doctors.filter(d => (d._id || d.id) !== id);
            setDoctors(updated);
            persistLocal(updated);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-[30px] shadow-sm border-b-4 border-blue-600">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-800">Doctor Panel</h1>
                <button onClick={() => { setEditId(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-black shadow-lg hover:scale-105 transition-all">
                    <UserPlus size={24}/> ADD NEW DOCTOR
                </button>
            </div>

            <div className="bg-white rounded-[40px] shadow-sm overflow-hidden border">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400 tracking-widest">
                        <tr>
                            <th className="p-6">Doctor Info</th>
                            <th className="p-6 text-center">Specialist</th>
                            <th className="p-6 text-center">Timings & Days</th>
                            <th className="p-6">Extra Columns</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {doctors.map(dr => (
                            <tr key={dr._id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="p-6">
                                    <div className="font-black text-gray-800 text-lg">{dr.name}</div>
                                    <div className="text-[10px] text-blue-500 font-bold uppercase">{dr.degree}</div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-600">{dr.specialist}</span>
                                </td>
                                <td className="p-6 text-center">
                                    <div className="text-sm font-black text-gray-700">{dr.timings}</div>
                                    <div className="text-[10px] text-gray-400 font-bold">{dr.availableDays}</div>
                                </td>
                                <td className="p-6 text-[10px] text-gray-400 italic">
                                    <p>C1: {dr.extra1 || '---'}</p>
                                    <p>C2: {dr.extra2 || '---'}</p>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(dr)} className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit size={18}/></button>
                                        <button onClick={() => handleDelete(dr._id || dr.id)} className="bg-red-50 text-red-400 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[50px] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black italic text-blue-800 uppercase tracking-tighter">{editId ? 'Update Doctor' : 'New Doctor'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black"><X size={30}/></button>
                        </div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            <input placeholder="Name (Dr. ...)" className="border-2 p-4 rounded-2xl font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            <input placeholder="Degree (MBBS, FCPS)" className="border-2 p-4 rounded-2xl font-bold" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} />
                            <input placeholder="Specialization" className="border-2 p-4 rounded-2xl font-bold" value={formData.specialist} onChange={e => setFormData({...formData, specialist: e.target.value})} />
                            <input placeholder="Mobile No" className="border-2 p-4 rounded-2xl font-bold" value={formData.cell} onChange={e => setFormData({...formData, cell: e.target.value})} />
                            <input placeholder="Timings (e.g. 10am-2pm)" className="border-2 p-4 rounded-2xl font-bold" value={formData.timings} onChange={e => setFormData({...formData, timings: e.target.value})} />
                            <input placeholder="Available Days" className="border-2 p-4 rounded-2xl font-bold" value={formData.availableDays} onChange={e => setFormData({...formData, availableDays: e.target.value})} />
                            <input placeholder="Extra Column 1" className="border-2 p-4 rounded-2xl font-bold bg-gray-50" value={formData.extra1} onChange={e => setFormData({...formData, extra1: e.target.value})} />
                            <input placeholder="Extra Column 2" className="border-2 p-4 rounded-2xl font-bold bg-gray-50" value={formData.extra2} onChange={e => setFormData({...formData, extra2: e.target.value})} />
                            
                            <button type="submit" className="col-span-2 bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-xl mt-4 hover:bg-blue-700">
                                {editId ? 'UPDATE RECORD' : 'SAVE DOCTOR'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorsTab;
