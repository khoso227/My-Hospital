import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FaTrash, FaUserPlus } from 'react-icons/fa';

const Staff = () => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', profession: '', cnic: '', mobile: '', 
        altMobile: '', address: '', extraColumn1: '', extraColumn2: ''
    });

    const cacheKey = 'staff_offline';
    const persistLocal = (list) => localStorage.setItem(cacheKey, JSON.stringify(list));

    // 1. Fetch Data
    const fetchStaff = async () => {
        try {
            const res = await api.get('/api/staff/all');
            setStaffList(res.data);
            persistLocal(res.data);
        } catch (err) {
            console.error("Fetch error, using cache:", err?.message);
            const cached = localStorage.getItem(cacheKey);
            if (cached) setStaffList(JSON.parse(cached));
        }
    };

    useEffect(() => { fetchStaff(); }, []);

    // 2. Handle Add
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/staff/add', formData);
            alert("Staff Added Successfully! ✅");
            setFormData({ name: '', profession: '', cnic: '', mobile: '', altMobile: '', address: '', extraColumn1: '', extraColumn2: '' });
            fetchStaff();
        } catch (err) {
            const localRecord = { ...formData, _id: Date.now().toString() };
            const updated = [localRecord, ...staffList];
            setStaffList(updated);
            persistLocal(updated);
            alert(err.response?.data?.message || "Backend offline. Saved locally.");
        } finally {
            setLoading(false);
        }
    };

    // 3. Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm("Khatam karna chahte hain?")) {
            try {
                await api.delete(`/api/staff/delete/${id}`);
                fetchStaff();
            } catch (err) {
                const updated = staffList.filter(s => (s._id || s.id) !== id);
                setStaffList(updated);
                persistLocal(updated);
                alert("Backend offline. Removed locally.");
            }
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black text-blue-900 mb-8 italic tracking-tighter uppercase underline decoration-blue-200">
                Staff Management
            </h1>

            {/* --- TABLE (AB UPAR HAI) --- */}
            <div className="bg-white rounded-[30px] shadow-xl overflow-hidden mb-10 border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-blue-900 text-white">
                        <tr className="text-[10px] font-black uppercase tracking-[3px]">
                            <th className="p-5">Name</th>
                            <th className="p-5">Profession</th>
                            <th className="p-5">CNIC</th>
                            <th className="p-5">Mobile</th>
                            <th className="p-5 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffList.length > 0 ? staffList.map((s) => (
                            <tr key={s._id || s.id} className="border-b hover:bg-blue-50/50 transition font-bold text-gray-700">
                                <td className="p-5 uppercase">{s.name}</td>
                                <td className="p-5"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[9px] font-black">{s.profession}</span></td>
                                <td className="p-5">{s.cnic}</td>
                                <td className="p-5">{s.mobile}</td>
                                <td className="p-5 text-center">
                                    <button onClick={() => handleDelete(s._id || s.id)} className="text-red-500 hover:scale-125 transition-transform">
                                        <FaTrash size={16} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-bold italic">No Staff Data Found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- FORM (AB NICHE HAI) --- */}
            <div className="bg-white p-10 rounded-[40px] shadow-2xl border-t-4 border-blue-600">
                <h2 className="text-xl font-black text-gray-800 mb-8 flex items-center gap-3 uppercase italic">
                    <FaUserPlus className="text-blue-600" /> Add Staff Member
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" placeholder="Full Name" value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} required className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold" />
                    
                    <select value={formData.profession} onChange={(e)=>setFormData({...formData, profession:e.target.value})} required className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black text-blue-600 cursor-pointer">
                        <option value="">Select Profession</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Receptionist">Receptionist</option>
                        <option value="Accountant">Accountant</option>
                        <option value="Security">Security</option>
                    </select>

                    <input type="text" placeholder="CNIC Number" value={formData.cnic} onChange={(e)=>setFormData({...formData, cnic:e.target.value})} required className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold" />
                    <input type="text" placeholder="Mobile Number" value={formData.mobile} onChange={(e)=>setFormData({...formData, mobile:e.target.value})} required className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold" />
                    <input type="text" placeholder="Alternative Phone" value={formData.altMobile} onChange={(e)=>setFormData({...formData, altMobile:e.target.value})} className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none font-bold" />
                    <input type="text" placeholder="Address" value={formData.address} onChange={(e)=>setFormData({...formData, address:e.target.value})} className="p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none font-bold" />
                    
                    <button type="submit" disabled={loading} className="md:col-span-2 bg-blue-600 text-white py-5 rounded-[30px] font-black uppercase tracking-widest hover:bg-blue-900 shadow-xl shadow-blue-100 transition-all active:scale-95">
                        {loading ? "SAVING..." : "SAVE STAFF MEMBER ✅"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Staff;
