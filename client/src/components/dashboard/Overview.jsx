import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useTranslation } from 'react-i18next';
import { 
  Users, Bed, CreditCard, Activity, 
  Plus, FileText, X, HeartPulse
} from 'lucide-react';
// Dono types ke charts yahan import kar liye hain
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- DATA: Weekly Flow ---
const chartData = [
  { name: 'Mon', patients: 400, revenue: 2400 },
  { name: 'Tue', patients: 300, revenue: 1398 },
  { name: 'Wed', patients: 900, revenue: 9800 },
  { name: 'Thu', patients: 278, revenue: 3908 },
  { name: 'Fri', patients: 689, revenue: 4800 },
  { name: 'Sat', patients: 239, revenue: 3800 },
  { name: 'Sun', patients: 349, revenue: 4300 },
];

// --- DATA: Monthly Revenue ---
const monthlyRevenue = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 8000 },
  { name: 'May', revenue: 6000 },
];

const Overview = () => {
  const { t } = useTranslation();
  
  // --- 1. STATES ---
  const [staff, setStaff] = useState([]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  
  const [patients] = useState([
    { id: 101, name: "Zahid Mehar", type: "OPD", status: "Checkup" },
    { id: 102, name: "Ali Nawaz", type: "Admitted", status: "Admitted" }
  ]);

  const [labTests] = useState([
    { id: 1, patient: "Kaka", test: "Urinary DR", paid: 5000 },
    { id: 2, patient: "Ali", test: "Urea DR", paid: 5000 }
  ]);

  const [beds] = useState({ total: 50 });

  // --- 2. BACKEND LOGIC ---
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get('/api/staff/all');
        setStaff(res.data);
      } catch (err) { console.error("Staff load failed"); }
    };
    fetchStaff();
  }, []);

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      const res = await api.post('/api/staff/add', data);
      setStaff([...staff, res.data]);
      alert("Staff Member Registered! ✅");
      setShowStaffModal(false);
    } catch (err) { alert("Database Error!"); }
  };

  // Calculations
  const admittedCount = patients.filter(p => p.type === 'Admitted').length;
  const currentRevenue = labTests.reduce((a, c) => a + c.paid, 0) + 15000;

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen animate-in fade-in duration-700">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black italic text-gray-800 tracking-tighter uppercase">Hospital Hub</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Master SaaS Control Panel</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowStaffModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-lg hover:scale-105 transition">+ Add Staff</button>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`Rs. ${currentRevenue}`} icon={<CreditCard />} color="bg-blue-600 text-white" />
        <StatCard title="Staff Active" value={staff.length} icon={<Users />} color="bg-white border text-blue-600" />
        <StatCard title="Occupancy" value={`${Math.round((admittedCount/beds.total)*100)}%`} icon={<Activity />} color="bg-teal-600 text-white" />
        <StatCard title="Beds Free" value={beds.total - admittedCount} icon={<Bed />} color="bg-slate-900 text-white" />
      </div>

      {/* --- MAIN ANALYTICS: WEEKLY FLOW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[45px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black italic uppercase mb-8 tracking-tighter">Weekly Patient Flow</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700}} />
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none'}} />
                <Area type="monotone" dataKey="patients" stroke="#2563eb" strokeWidth={4} fill="url(#colorPv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LIVE ACTIVITY */}
        <div className="bg-gray-900 p-8 rounded-[45px] shadow-2xl text-white">
          <h3 className="text-xl font-black uppercase tracking-tighter mb-8 italic text-blue-400">Live Activity</h3>
          <div className="space-y-6">
            <ActivityItem time="Just Now" text="Ali Admitted to Surgery" c="bg-red-500" />
            <ActivityItem month="Update" text="Stock Re-filled" c="bg-green-500" />
            <ActivityItem time="1h ago" text="New Staff Entry" c="bg-blue-500" />
          </div>
        </div>
      </div>

      {/* --- NEW: MONTHLY REVENUE ANALYTICS (Pasted Section) --- */}
      <div className="bg-white p-8 rounded-[45px] shadow-xl border border-gray-100">
        <h3 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-tighter italic">
          Monthly Revenue Trends
        </h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2563eb" 
                strokeWidth={5} 
                dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- STAFF MODAL --- */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[500] backdrop-blur-md">
          <form onSubmit={handleSaveStaff} className="bg-white p-10 rounded-[50px] w-full max-w-2xl shadow-2xl relative animate-in zoom-in duration-300">
            <button type="button" onClick={() => setShowStaffModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-red-500"><X size={24}/></button>
            <h2 className="text-3xl font-black text-blue-900 mb-8 uppercase tracking-tighter italic text-center underline decoration-blue-100">Staff Registration</h2>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" placeholder="Full Name" className="p-4 bg-gray-50 border-2 rounded-2xl outline-none focus:border-blue-500 font-bold" required />
              <input name="cnic" placeholder="CNIC Number" className="p-4 bg-gray-50 border-2 rounded-2xl outline-none focus:border-blue-500 font-bold" required />
              <input name="mobile" placeholder="Mobile Number" className="p-4 bg-gray-50 border-2 rounded-2xl outline-none focus:border-blue-500 font-bold" required />
              <input name="address" placeholder="Address" className="p-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold" />
            </div>
            <button type="submit" className="w-full mt-8 bg-blue-900 text-white py-5 rounded-[30px] font-black shadow-xl hover:bg-black uppercase tracking-widest transition-all">SAVE TO DATABASE ✅</button>
          </form>
        </div>
      )}
    </div>
  );
};

// --- SUB COMPONENTS ---
const StatCard = ({ title, value, icon, color }) => (
  <div className={`${color} p-8 rounded-[40px] shadow-xl relative overflow-hidden group hover:scale-[1.03] transition-all`}>
    <div className="absolute -right-2 -top-2 opacity-10 group-hover:scale-125 transition-transform">{icon}</div>
    <p className="text-[10px] font-black uppercase opacity-70 mb-2 tracking-widest">{title}</p>
    <h2 className="text-3xl font-black tracking-tighter">{value}</h2>
  </div>
);

const ActivityItem = ({ time, text, c }) => (
  <div className="flex gap-4 items-start border-b border-white/5 pb-3">
    <div className={`w-2 h-2 mt-1.5 rounded-full ${c} shadow-lg`}></div>
    <div>
      <p className="text-xs font-bold text-gray-100">{text}</p>
      <p className="text-[9px] text-gray-500 font-bold uppercase">{time}</p>
    </div>
  </div>
);

export default Overview;