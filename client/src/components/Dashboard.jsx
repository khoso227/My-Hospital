import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Users, UserRound, Beaker, Pill, Settings } from 'lucide-react';

const DashboardLayout = () => {
  const { i18n } = useTranslation();

  // --- 1. WHITE-LABEL BRANDING: LocalStorage se hospital ka naam uthana ---
  const hospitalName = localStorage.getItem('hospitalName') || 'HOSPITAL PRO';

  // --- 2. LANGUAGE LOGIC (English, Urdu, Sindhi) ---
  const changeLanguage = (lng) => {
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(lng);
      // RTL Setup for Urdu/Sindhi
      document.body.dir = (lng === 'ur' || lng === 'sd') ? 'rtl' : 'ltr';
    }
  };

  // --- 3. TABS CONFIGURATION (Including New Settings Tab) ---
  const tabs = [
    { id: 'overview', name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'doctors', name: 'Doctors', path: '/dashboard/doctors', icon: <Users size={18} /> },
    { id: 'patients', name: 'Patients', path: '/dashboard/patients', icon: <UserRound size={18} /> },
    { id: 'labs', name: 'Labs', path: '/dashboard/labs', icon: <Beaker size={18} /> },
    { id: 'pharmacy', name: 'Pharmacy', path: '/dashboard/pharmacy', icon: <Pill size={18} /> },
    { id: 'settings', name: 'Settings', path: '/dashboard/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-gray-50 font-sans">
      
      {/* --- 4. HEADER SECTION (Dynamic Branding) --- */}
      <header className="bg-blue-800 text-white p-4 flex justify-between items-center shadow-lg px-8 shrink-0">
        <div className="flex flex-col">
          <h2 className="font-bold text-lg uppercase tracking-widest italic leading-none">
            {hospitalName}
          </h2>
          <span className="text-[8px] font-bold text-blue-300 tracking-[0.3em] uppercase mt-1">
            Smart Hospital SaaS System
          </span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => changeLanguage('en')} 
            className="bg-blue-700 hover:bg-blue-600 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
          >
            English
          </button>
          <button 
            onClick={() => changeLanguage('ur')} 
            className="bg-green-700 hover:bg-green-600 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 font-urdu"
          >
            اردو
          </button>
          <button 
            onClick={() => changeLanguage('sd')} 
            className="bg-red-700 hover:bg-red-600 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
          >
            سنڌي
          </button>
        </div>
      </header>

      {/* --- 5. TABS NAVIGATION (Professional Nav Bar) --- */}
      <div className="bg-white border-b px-8 py-3 flex gap-4 overflow-x-auto shadow-sm shrink-0">
        {tabs.map((tab) => (
          <NavLink
            key={tab.id}
            to={tab.path}
            end={tab.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-6 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                isActive 
                ? 'bg-blue-600 text-white shadow-xl scale-105' 
                : 'text-gray-400 hover:bg-gray-100 hover:text-blue-600'
              }`
            }
          >
            {tab.icon}
            <span>{tab.name}</span>
          </NavLink>
        ))}
      </div>

      {/* --- 6. MAIN CONTENT AREA --- */}
      {/* 'Outlet' un components ko load karega jo App.jsx mein defined hain */}
      <main className="p-8 overflow-y-auto flex-1 bg-gray-50/50">
        <Outlet />
      </main>

    </div>
  );
};

export default DashboardLayout;