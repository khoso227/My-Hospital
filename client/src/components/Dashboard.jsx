import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Register Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Icons – sab lucide-react se, HiUsers aur HiStatusOnline hata diye
import {
  LayoutDashboard, Users, UserRound, Beaker, Pill, Settings,
  Stethoscope, HeartPulse, Plus, Printer, Save, X as CloseIcon,
  Cog as HiCog, Home as HiHome, ChartBar as HiChartBar,
  Wifi, Menu  // Hospital Identity ke liye
} from 'lucide-react';

// ──────────────────────────────────────────────────────────
const DashboardLayout = ({ onToggleSidebar }) => {
  const { i18n } = useTranslation();
  const location = useLocation();

  // Branding & Admin States
  const [hospitalName, setHospitalName] = useState(localStorage.getItem('hospitalName') || 'KHOSO HOSPITAL');
  const [tempHospitalName, setTempHospitalName] = useState(hospitalName);
  const [hospitalAddress, setHospitalAddress] = useState(localStorage.getItem('hospitalAddress') || 'City Medical Center, Ghotki');
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || 'Sarang Khoso');
  const [adminEmail, setAdminEmail] = useState(localStorage.getItem('adminEmail') || 'admin@khosohospital.com');
  const [loadingSave, setLoadingSave] = useState(false);

  // Language Switcher
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.body.dir = (lng === 'ur' || lng === 'sd') ? 'rtl' : 'ltr';
  };

  // Theme (Day/Night)
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Save Settings
  const handleSaveSettings = () => {
    setLoadingSave(true);
    setTimeout(() => {
      localStorage.setItem('hospitalName', tempHospitalName);
      localStorage.setItem('hospitalAddress', hospitalAddress);
      localStorage.setItem('adminName', adminName);
      localStorage.setItem('adminEmail', adminEmail);
      setHospitalName(tempHospitalName);
      setLoadingSave(false);
      alert('Settings saved successfully!');
      // window.location.reload(); // optional
    }, 800);
  };

  // Navigation Tabs
  const tabs = [
    { id: 'overview', name: 'Overview', path: '/dashboard', icon: <HiChartBar size={18} /> },
    { id: 'staff', name: 'Hospital Staff', path: '/dashboard/staff', icon: <Users size={18} /> },
    { id: 'doctors', name: 'Doctors', path: '/dashboard/doctors', icon: <Stethoscope size={18} /> },
    { id: 'patients', name: 'Patients', path: '/dashboard/patients', icon: <UserRound size={18} /> },
    { id: 'labs', name: 'Labs', path: '/dashboard/labs', icon: <Beaker size={18} /> },
    { id: 'pharmacy', name: 'Pharmacy', path: '/dashboard/pharmacy', icon: <Pill size={18} /> },
    { id: 'settings', name: 'Settings', path: '/dashboard/settings', icon: <Settings size={18} /> },
  ];

  // Live Patients (with offline cache)
  const totalBeds = 20;
  const [patients, setPatients] = useState([]);

  const patientCacheKey = 'patients_offline';

  const persistPatients = (list) => localStorage.setItem(patientCacheKey, JSON.stringify(list));

  const loadPatientCache = () => {
    const cached = localStorage.getItem(patientCacheKey);
    if (cached) {
      try { setPatients(JSON.parse(cached)); } catch {/* ignore parse errors */}
    }
  };

  const fetchPatients = async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);
      const res = await axios.get('https://my-hospital-odec.vercel.app/api/patients', { signal: controller.signal });
      clearTimeout(timer);
      if (res.data?.success) {
        setPatients(res.data.data);
        persistPatients(res.data.data);
        return;
      }
    } catch (err) {
      console.log('Patient API unreachable, using cached data if available');
    }
    loadPatientCache();
  };

  useEffect(() => { loadPatientCache(); fetchPatients(); }, []);

  // Chart Data (Weekly Patient Flow) based on available patient records
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayCounts = (() => {
    const counts = Array(7).fill(0);
    patients.forEach(p => {
      const d = p.createdAt ? new Date(p.createdAt) : new Date();
      const idx = d.getDay(); // 0=Sun ... 6=Sat
      const mapped = idx === 0 ? 6 : idx - 1; // shift to Mon=0
      counts[mapped] += 1;
    });
    // fallback to at least one bar if no data
    if (patients.length === 0) return Array(7).fill(0);
    return counts;
  })();

  const chartData = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Patients',
        data: dayCounts,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3b82f6',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e40af' } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' } },
      x: { grid: { display: false } },
    },
  };

  // Prescription Modal States
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    bp: '', weight: '', temp: '',
    medicines: [{ name: '', dose: '', duration: '' }],
  });

  const addMedicineRow = () => {
    setPrescriptionForm(p => ({ ...p, medicines: [...p.medicines, { name: '', dose: '', duration: '' }] }));
  };

  const updateMedicine = (idx, field, val) => {
    setPrescriptionForm(p => {
      const meds = [...p.medicines];
      meds[idx][field] = val;
      return { ...p, medicines: meds };
    });
  };

  const generatePrescriptionPDF = () => {
    alert('Prescription PDF generated!');
    setShowPrescriptionModal(null);
  };

  // Derived counts
  const admittedCount = patients.filter(
    (p) => p.type === 'Admit' && !['Discharged', 'Referred', 'Death', 'OPD Return'].includes(p.status)
  ).length;
  const bedsAvailable = totalBeds - admittedCount;
  const beds = Array.from({ length: totalBeds }, (_, i) => ({
    id: i + 1,
    status: i < admittedCount ? 'Occupied' : 'Available',
  }));
  const totalPatients = patients.length;
  const activePatients = patients.filter(p => p.status === 'Active').length;

  // ──────────────────────────────────────────────────────────
  return (
    <div className={`flex flex-col h-screen overflow-hidden font-sans transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-gray-50/80 text-gray-900'}`}>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-4 md:px-10 py-4 flex justify-between items-center shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden p-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 active:scale-95 transition"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>
          <div>
            <h2 className="font-black text-2xl uppercase tracking-wider italic">{hospitalName}</h2>
            <span className="text-xs font-bold text-blue-200 tracking-widest uppercase">SMART HOSPITAL SaaS</span>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="px-4 py-1.5 rounded text-xs font-black uppercase transition shadow-md bg-white/10 border border-white/20 hover:bg-white/20 active:scale-95"
          >
            {isDark ? 'Day' : 'Night'}
          </button>
          {['en', 'ur', 'sd'].map(lng => (
            <button
              key={lng}
              onClick={() => changeLanguage(lng)}
              className={`px-4 py-1.5 rounded text-xs font-black uppercase transition shadow-md ${
                lng === 'en' ? 'bg-blue-600' : lng === 'ur' ? 'bg-green-600' : 'bg-red-600'
              } hover:brightness-110 active:scale-95`}
            >
              {lng === 'en' ? 'English' : lng === 'ur' ? 'اردو' : 'سنڌي'}
            </button>
          ))}
        </div>
      </header>

      {/* TABS */}
      <nav className={`${isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-b'} shadow-sm shrink-0 overflow-x-auto`}>
        <div className="px-6 md:px-10 py-3 flex gap-3">
          {tabs.map(tab => (
            <NavLink
              key={tab.id}
              to={tab.path}
              end={tab.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wide transition whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`
              }
            >
              {tab.icon}
              {tab.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className={`flex-1 p-6 md:p-8 overflow-y-auto ${isDark ? 'bg-slate-900 text-slate-100' : ''}`}>

        {location.pathname === '/dashboard/settings' ? (

          /* SETTINGS PAGE – Fixed icon (HiUsers → Users) */
          <div className="max-w-4xl mx-auto py-6 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-8 py-10 text-white text-center">
                <Settings size={48} className="mx-auto mb-4 opacity-80" />
                <h1 className="text-3xl font-black uppercase tracking-tight">System Settings</h1>
                <p className="mt-2 text-blue-200 text-sm font-medium">
                  Manage hospital branding and admin account
                </p>
              </div>

              {/* Form Content */}
              <div className="p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-10">

                  {/* Hospital Branding */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                      <Wifi className="text-blue-600 text-2xl" />
                      <h2 className="text-xl font-black text-gray-800 uppercase tracking-wide">Hospital Identity</h2>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Hospital Name</label>
                        <input
                          type="text"
                          value={tempHospitalName}
                          onChange={e => setTempHospitalName(e.target.value)}
                          placeholder="e.g. Khoso Hospital"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-medium text-lg transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Hospital Address</label>
                        <input
                          type="text"
                          value={hospitalAddress}
                          onChange={e => setHospitalAddress(e.target.value)}
                          placeholder="e.g. City Medical Center, Ghotki, Sindh"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none font-medium text-lg transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Admin Profile – Icon fixed */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                      <Users className="text-green-600 text-2xl" /> {/* ← Fixed: HiUsers → Users */}
                      <h2 className="text-xl font-black text-gray-800 uppercase tracking-wide">Admin Profile</h2>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Full Name</label>
                        <input
                          type="text"
                          value={adminName}
                          onChange={e => setAdminName(e.target.value)}
                          placeholder="e.g. Sarang Khoso"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none font-medium text-lg transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Email Address</label>
                        <input
                          type="email"
                          value={adminEmail}
                          onChange={e => setAdminEmail(e.target.value)}
                          placeholder="admin@khosohospital.com"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none font-medium text-lg transition"
                        />
                      </div>

                      {/* Password Change */}
                      <div className="pt-4 border-t border-gray-200">
                        <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Change Password</label>
                        <div className="space-y-4">
                          <input type="password" placeholder="Current Password" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-purple-500 outline-none" />
                          <input type="password" placeholder="New Password" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-purple-500 outline-none" />
                          <input type="password" placeholder="Confirm New Password" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-purple-500 outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="px-8 py-6 bg-gray-50 border-t flex justify-end gap-4">
                <button
                  onClick={() => {
                    alert("Settings saved successfully! (Password change requires backend verification)");
                    handleSaveSettings();
                  }}
                  disabled={loadingSave}
                  className={`px-10 py-4 bg-blue-700 text-white font-black text-lg rounded-2xl shadow-lg hover:bg-blue-800 transition transform active:scale-95 flex items-center gap-3 ${
                    loadingSave ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <Save size={22} />
                  SAVE ALL CHANGES
                </button>
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-6">
              © {new Date().getFullYear()} {hospitalName} • Powered by Hospital Pro SaaS
            </p>
          </div>

        ) : location.pathname === '/dashboard' ? (

          /* OVERVIEW DASHBOARD */
          <div className="space-y-8 md:space-y-10">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: 'Total Patients', value: totalPatients, color: 'blue' },
                { title: 'Admitted Patients', value: admittedCount, color: 'red' },
                { title: 'Beds Available', value: `${bedsAvailable}/${totalBeds}`, color: 'green' },
                { title: 'Active Patients', value: activePatients, color: 'purple' },
              ].map((item, i) => (
                <div key={i} className={`${isDark ? 'bg-slate-800 text-slate-100' : 'bg-white text-gray-800'} rounded-2xl shadow-lg p-6 border-t-4 border-${item.color}-600`}>
                  <p className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>{item.title}</p>
                  <p className="text-3xl font-black mt-2">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Weekly Patient Flow Chart */}
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} rounded-3xl shadow-xl p-6 md:p-8 border`}>
              <h3 className={`text-xl md:text-2xl font-black mb-6 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>Weekly Patient Flow</h3>
              <div className="h-80 md:h-96">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Bed Map */}
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white'} rounded-3xl shadow-xl p-6 md:p-8`}>
              <h3 className={`text-xl font-black uppercase mb-6 flex items-center gap-3 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>
                <HiHome className="text-blue-600" /> Ward Bed Occupancy
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {beds.map(bed => (
                  <div
                    key={bed.id}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-xs font-black border transition-all ${
                      bed.status === 'Available'
                        ? `${isDark ? 'bg-green-950/40 border-green-700 text-green-200' : 'bg-green-50 border-green-200 text-green-700'} hover:scale-105`
                        : `${isDark ? 'bg-red-950/40 border-red-700 text-red-200 opacity-80' : 'bg-red-50 border-red-200 text-red-700 opacity-70'}`
                    }`}
                  >
                    <HeartPulse size={18} />
                    <div className="mt-1">B-{bed.id}</div>
                    <div className="text-[9px] uppercase mt-0.5 font-medium">{bed.status}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        ) : (
          <Outlet />
        )}

      </main>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative">
            <button onClick={() => setShowPrescriptionModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-red-600">
              <CloseIcon size={28} />
            </button>
            <h2 className="text-2xl font-black mb-6">Write Prescription</h2>
            {/* Add your form fields here */}
            <button onClick={generatePrescriptionPDF} className="mt-6 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold">
              Generate PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardLayout;
