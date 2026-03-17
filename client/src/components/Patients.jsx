import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserCheck, Bed, Search, Filter, Printer, Loader2 } from 'lucide-react';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [stats, setStats] = useState({ total: 0, opd: 0, admitted: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://my-hospital-odec.vercel.app/api/patients');
            if (res.data.success) {
                const data = res.data.data;
                setPatients(data);
                setStats({
                    total: data.length,
                    opd: data.filter(p => p.type === 'OPD').length,
                    admitted: data.filter(p => p.type === 'Admit').length
                });
            }
        } catch (err) {
            console.error("Data Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredPatients = patients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.cell && p.cell.includes(searchTerm))
    );

    if (loading) return (
        <div className="h-full w-full flex items-center justify-center p-20">
            <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
    );

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-center no-print">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-gray-800 uppercase">Patient Database</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Hospital Management & Stats</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={fetchData} className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl font-bold hover:bg-blue-100 transition">Refresh</button>
                    <button onClick={() => window.print()} className="bg-white p-4 rounded-2xl shadow-sm border hover:bg-gray-50 transition-all">
                        <Printer size={24} className="text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-60 mb-1">Total Registered</p>
                        <h2 className="text-5xl font-black tracking-tighter">{stats.total}</h2>
                    </div>
                    <Users size={48} className="opacity-20" />
                </div>

                <div className="bg-white p-8 rounded-[40px] border-2 border-blue-50 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">OPD Patients</p>
                        <h2 className="text-5xl font-black text-blue-600 tracking-tighter">{stats.opd}</h2>
                    </div>
                    <UserCheck size={48} className="text-blue-100" />
                </div>

                <div className="bg-white p-8 rounded-[40px] border-2 border-teal-50 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Admitted (In-Ward)</p>
                        <h2 className="text-5xl font-black text-teal-600 tracking-tighter">{stats.admitted}</h2>
                    </div>
                    <Bed size={48} className="text-teal-100" />
                </div>
            </div>

            <div className="bg-white p-4 rounded-[30px] shadow-sm border flex gap-4 no-print">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-4 text-gray-300" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name or mobile..." 
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 outline-none font-bold"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[45px] shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                            <th className="p-6">Patient Details</th>
                            <th className="p-6">Contact</th>
                            <th className="p-6 text-center">Category</th>
                            <th className="p-6 text-center">Status</th>
                            <th className="p-6 text-right">Reg. Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredPatients.map(p => (
                            <tr key={p._id} className="hover:bg-blue-50/40 transition-colors">
                                <td className="p-6">
                                    <div className="font-black text-gray-800 text-lg">{p.name}</div>
                                    <div className="text-[10px] text-blue-500 font-bold uppercase">{p.disease || 'General'}</div>
                                </td>
                                <td className="p-6">
                                    <div className="font-bold text-gray-600">{p.cell || 'No Mobile'}</div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase ${p.type === 'Admit' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {p.type || 'OPD'}
                                    </span>
                                </td>
                                <td className="p-6 text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-green-50 text-green-600">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        {p.status}
                                    </div>
                                </td>
                                <td className="p-6 text-right font-bold text-gray-400 text-xs">
                                    {new Date(p.createdAt).toLocaleDateString()}
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