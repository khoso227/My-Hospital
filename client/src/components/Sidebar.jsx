import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  List, 
  Calendar, 
  Beaker, 
  Pill, 
  LogOut,
  Stethoscope,
  Activity
} from 'lucide-react';

const Sidebar = () => {
  const { t } = useTranslation();

  // DYNAMIC BRANDING: Priority to user-set name, fallback to translation or default
  const hospitalName = localStorage.getItem('hospitalName') || t('hospital_name') || 'HOSPITAL PRO';

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to Logout?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="w-72 bg-blue-900 h-screen text-white flex flex-col shadow-2xl transition-all duration-300 shrink-0">
      
      {/* 1. BRAND AREA (White-Label Enabled) */}
      <div className="p-8 border-b border-blue-800 text-center">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic text-blue-50 leading-tight">
          {hospitalName}
        </h1>
        <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[4px] mt-2">
          Smart SaaS System
        </p>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        
        {/* --- MAIN SECTION --- */}
        <div className="mb-6">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center px-6 py-4 rounded-2xl transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-blue-300 hover:bg-blue-800 hover:text-white font-medium'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 mr-4 group-hover:scale-110 transition" />
            <span className="font-black uppercase text-[10px] tracking-widest">
              {t('dashboard') || 'Dashboard'}
            </span>
          </NavLink>
        </div>

        {/* --- PATIENTS MANAGEMENT (Grouped Section) --- */}
        <div className="mb-6">
          <p className="px-6 text-[9px] uppercase font-black text-blue-500 tracking-[4px] mb-3">
            {t('patients') || 'Patients List'}
          </p>
          
          <div className="space-y-1">
            <NavLink
              to="/patients"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 rounded-2xl transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-200 hover:bg-blue-800'
                }`
              }
            >
              <List className="w-5 h-5 mr-4" />
              <span className="font-bold text-xs uppercase tracking-wider">All Records</span>
            </NavLink>

            <NavLink
              to="/dashboard/patients"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 rounded-2xl transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-200 hover:bg-blue-800'
                }`
              }
            >
              <UserPlus className="w-5 h-5 mr-4" />
              <span className="font-bold text-xs uppercase tracking-wider">{t('add_new') || 'Add New'}</span>
            </NavLink>
          </div>
        </div>

        {/* --- MEDICAL SERVICES --- */}
        <div className="space-y-1">
          <p className="px-6 text-[9px] uppercase font-black text-blue-500 tracking-[4px] mb-3">
            Services
          </p>

          <NavLink
            to="/dashboard/doctors"
            className={({ isActive }) =>
              `flex items-center px-6 py-4 rounded-2xl transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-200 hover:bg-blue-800'
              }`
            }
          >
            <Stethoscope className="w-5 h-5 mr-4" />
            <span className="font-bold text-xs uppercase tracking-wider">{t('doctors') || 'Doctors'}</span>
          </NavLink>

          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `flex items-center px-6 py-4 rounded-2xl transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-200 hover:bg-blue-800'
              }`
            }
          >
            <Calendar className="w-5 h-5 mr-4" />
            <span className="font-bold text-xs uppercase tracking-wider">{t('appointments') || 'Appointments'}</span>
          </NavLink>

          <NavLink
            to="/dashboard/labs"
            className={({ isActive }) =>
              `flex items-center px-6 py-4 rounded-2xl transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-200 hover:bg-blue-800'
              }`
            }
          >
            <Activity className="w-5 h-5 mr-4" />
            <span className="font-bold text-xs uppercase tracking-wider">{t('labs') || 'Labs'}</span>
          </NavLink>

          <NavLink
            to="/dashboard/pharmacy"
            className={({ isActive }) =>
              `flex items-center px-6 py-4 rounded-2xl transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-200 hover:bg-blue-800'
              }`
            }
          >
            <Pill className="w-5 h-5 mr-4" />
            <span className="font-bold text-xs uppercase tracking-wider">{t('pharmacy') || 'Pharmacy'}</span>
          </NavLink>
        </div>
      </nav>

      {/* 3. LOGOUT & FOOTER */}
      <div className="p-6 border-t border-blue-800 space-y-6">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-blue-400 hover:bg-red-600 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest border border-blue-800 hover:border-red-600 shadow-inner"
        >
          <LogOut size={18} />
          <span>Logout System</span>
        </button>

        <div className="text-[8px] text-blue-500 font-bold uppercase tracking-[2px] text-center">
          © {new Date().getFullYear()} {hospitalName} <br/>
          <span className="opacity-50">Powered by Hospital Pro SaaS</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;