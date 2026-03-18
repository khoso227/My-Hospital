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

const Sidebar = ({ isMobileOpen = false, closeSidebar, onLogout }) => {
  const { t } = useTranslation();

  // DYNAMIC BRANDING: Priority to user-set name, fallback to translation or default
  const hospitalName = localStorage.getItem('hospitalName') || t('hospital_name') || 'HOSPITAL PRO';

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    if (window.confirm("Are you sure you want to Logout?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-green-900 h-screen text-white flex flex-col shadow-2xl
        transform transition-transform duration-300 shrink-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative
      `}
    >
      
      {/* 1. BRAND AREA (White-Label Enabled) */}
      <div className="p-8 border-b border-green-800 text-center">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic text-green-50 leading-tight">
          {hospitalName}
        </h1>
        <p className="text-[9px] text-green-200 font-bold uppercase tracking-[4px] mt-2">
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
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-green-200 hover:bg-green-800 hover:text-white font-medium'
              }`
            }
            onClick={closeSidebar}
          >
              <LayoutDashboard className="w-5 h-5 mr-4 group-hover:scale-110 transition" />
              <span className="font-black uppercase text-[10px] tracking-widest">
                {t('dashboard') || 'Dashboard'}
              </span>
          </NavLink>
        </div>

        {/* --- PATIENTS MANAGEMENT (Grouped Section) --- */}
        <div className="mb-6">
          <p className="px-6 text-[9px] uppercase font-black text-green-400 tracking-[4px] mb-3">
            {t('patients') || 'Patients List'}
          </p>
          
          <div className="space-y-1">
            <NavLink
              to="/patients"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 rounded-2xl transition-all ${
                  isActive ? 'bg-green-600 text-white shadow-lg' : 'text-green-200 hover:bg-green-800'
                }`
              }
            onClick={closeSidebar}
          >
              <List className="w-5 h-5 mr-4" />
              <span className="font-bold text-xs uppercase tracking-wider">All Records</span>
            </NavLink>

            <NavLink
              to="/dashboard/patients"
              className={({ isActive }) =>
                `flex items-center px-6 py-3 rounded-2xl transition-all ${
                  isActive ? 'bg-green-600 text-white shadow-lg' : 'text-green-200 hover:bg-green-800'
                }`
              }
            onClick={closeSidebar}
          >
              <UserPlus className="w-5 h-5 mr-4" />
              <span className="font-bold text-xs uppercase tracking-wider">{t('add_new') || 'Add New'}</span>
            </NavLink>
          </div>
        </div>

        {/* --- MEDICAL & STAFF SERVICES --- */}
        <div className="space-y-1">
          <p className="px-6 text-[9px] uppercase font-black text-green-400 tracking-[4px] mb-3">
            Services
          </p>

          {/* NAYA STAFF MANAGEMENT LINK ✅ */}
          <NavLink
            to="/dashboard/staff"
            className={({ isActive }) =>
              `flex items-center px-6 py-4 rounded-2xl transition-all ${
                isActive ? 'bg-green-600 text-white shadow-lg' : 'text-green-200 hover:bg-green-800'
              }`
            }
            onClick={closeSidebar}
          >
            <Users className="w-5 h-5 mr-4" />
            <span className="font-bold text-xs uppercase tracking-wider">{t('staff') || 'Staff Management'}</span>
          </NavLink>

          <NavLink
            to="/dashboard/doctors"
            className={({ isActive }) =>
              `flex items-center px-6 py-4 rounded-2xl transition-all ${
                isActive ? 'bg-green-600 text-white shadow-lg' : 'text-green-200 hover:bg-green-800'
              }`
            }
            onClick={closeSidebar}
          >
            <Stethoscope className="w-5 h-5 mr-4" />
            <span className="font-bold text-xs uppercase tracking-wider">{t('doctors') || 'Doctors'}</span>
          </NavLink>

          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `flex items-center px-6 py-4 rounded-2xl transition-all ${
                isActive ? 'bg-green-600 text-white shadow-lg' : 'text-green-200 hover:bg-green-800'
              }`
            }
            onClick={closeSidebar}
          >
            <Calendar className="w-5 h-5 mr-4" />
            <span className="font-bold text-xs uppercase tracking-wider">{t('appointments') || 'Appointments'}</span>
          </NavLink>

          <NavLink
            to="/dashboard/labs"
            className={({ isActive }) =>
              `flex items-center px-6 py-4 rounded-2xl transition-all ${
                isActive ? 'bg-green-600 text-white shadow-lg' : 'text-green-200 hover:bg-green-800'
              }`
            }
            onClick={closeSidebar}
          >
            <Activity className="w-5 h-5 mr-4" />
            <span className="font-bold text-xs uppercase tracking-wider">{t('labs') || 'Labs'}</span>
          </NavLink>

          <NavLink
            to="/dashboard/pharmacy"
            className={({ isActive }) =>
              `flex items-center px-6 py-4 rounded-2xl transition-all ${
                isActive ? 'bg-green-600 text-white shadow-lg' : 'text-green-200 hover:bg-green-800'
              }`
            }
            onClick={closeSidebar}
          >
            <Pill className="w-5 h-5 mr-4" />
            <span className="font-bold text-xs uppercase tracking-wider">{t('pharmacy') || 'Pharmacy'}</span>
          </NavLink>
        </div>
      </nav>

      {/* 3. LOGOUT & FOOTER */}
      <div className="p-6 border-t border-green-800 space-y-6">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-green-200 hover:bg-red-600 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest border border-green-800 hover:border-red-600 shadow-inner"
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
