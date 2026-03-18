import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';

// Layout and Common Components
import Sidebar from './components/Sidebar';
import DashboardLayout from './components/Dashboard'; // Isme Outlet hai
import Patients from './components/Patients';
import AddPatient from './components/AddPatient';
import Appointments from './components/Appointments';

// Naya Staff Component Import
import Staff from './pages/Staff/Staff';

// Dashboard Sub-Tabs (Functional Components)
import Overview from './components/dashboard/Overview';
import DoctorsTab from './components/dashboard/DoctorsTab';
import PatientsTab from './components/dashboard/PatientsTab';
import LabsTab from './components/dashboard/LabsTab';
import PharmacyTab from './components/dashboard/PharmacyTab';
import SettingsTab from './components/dashboard/SettingsTab';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Auth ko temporarily skip kar rahe hain — app direct dashboard par open hoga
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to Logout?")) {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans relative">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile menu trigger (always available) */}
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-20 bg-blue-600 text-white p-3 rounded-full shadow-lg border border-white/20 active:scale-95"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
      )}

      <Sidebar
        onLogout={handleLogout}
        isMobileOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
      />

      <div className="flex-1 overflow-auto relative z-0">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={<DashboardLayout onToggleSidebar={toggleSidebar} />}
          >
            <Route index element={<Overview />} />
            <Route path="staff" element={<Staff />} />
            <Route path="doctors" element={<DoctorsTab />} />
            <Route path="patients" element={<PatientsTab />} />
            <Route path="labs" element={<LabsTab />} />
            <Route path="pharmacy" element={<PharmacyTab />} />
            <Route path="settings" element={<SettingsTab />} />
          </Route>

          <Route path="/patients" element={<Patients />} />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/appointments" element={<Appointments />} />

          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-full bg-white">
                <div className="text-center animate-in fade-in zoom-in duration-500">
                  <h1 className="text-[150px] font-black text-gray-100 leading-none">404</h1>
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-lg font-black uppercase text-xs tracking-[5px] inline-block -mt-10 mb-8">
                    Page Not Found
                  </div>
                  <p className="text-gray-500 font-bold mb-8">
                    Oops! The page you are looking for doesn't exist.
                  </p>
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase italic tracking-tighter"
                  >
                    Back to Safe Zone
                  </button>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
