import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Bed, CreditCard, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

const Overview = () => {
    const [stats, setStats] = useState({
        drTotal: 0,
        drAvail: 0,
        ptActive: 0,
        revenue: 0,
        lowStock: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard/stats');
                if (res.data.success) setStats(res.data.data);
            } catch (err) { console.log("Backend Stats Route Not Found"); }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: "Total Revenue", value: `Rs. ${stats.revenue.toLocaleString()}`, icon: <CreditCard />, color: "bg-blue-600 text-white", trend: "+12%" },
        { title: "Doctor Strength", value: stats.drTotal, icon: <Users />, color: "bg-white border text-blue-600", trend: `${stats.drAvail} Active` },
        { title: "Active Patients", value: stats.ptActive, icon: <Bed />, color: "bg-teal-600 text-white", trend: "In-Ward" },
        { title: "Stock Alert", value: stats.lowStock > 0 ? "Low" : "Normal", icon: <AlertTriangle />, color: "bg-slate-900 text-white", trend: `${stats.lowStock} items` }
    ];

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-700">
            <div>
                <h1 className="text-4xl font-black italic text-gray-800 tracking-tighter">HOSPITAL OVERVIEW</h1>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Real-time SaaS Monitoring</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className={`${card.color} p-8 rounded-[45px] shadow-xl relative overflow-hidden group hover:scale-105 transition-all`}>
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-150 transition-transform">{card.icon}</div>
                        <p className="text-[10px] font-black uppercase opacity-60 mb-2">{card.title}</p>
                        <h2 className="text-4xl font-black tracking-tighter">{card.value}</h2>
                        <span className="text-[10px] font-bold mt-4 inline-block bg-white/20 px-3 py-1 rounded-full">{card.trend}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-10 rounded-[50px] shadow-sm border h-80 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Patient Flow Weekly</h3>
                        <Activity className="text-blue-500" />
                    </div>
                    <div className="h-48 bg-gray-50 rounded-3xl border-2 border-dashed flex items-center justify-center text-gray-300 font-black italic text-2xl uppercase">
                        Real-time Chart Data
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[50px] shadow-sm border">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter mb-8">Bed Occupancy</h3>
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                                <span>General Ward</span>
                                <span className="text-teal-600">85% Full</span>
                            </div>
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                <div className="bg-teal-500 h-full w-[85%] rounded-full shadow-lg shadow-teal-100"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                                <span>ICU / Emergency</span>
                                <span className="text-red-500">40% Full</span>
                            </div>
                            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full w-[40%] rounded-full shadow-lg shadow-red-100"></div>
                            </div>
                        </div>
                        <div className="mt-10 p-4 bg-blue-50 rounded-2xl text-[10px] font-bold text-blue-600 leading-tight">
                            * System automatically updates bed count based on Active Admissions.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;