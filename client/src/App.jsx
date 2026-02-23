import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Component
import Login from './components/Login';

// Layout and Common Components
import Sidebar from './components/Sidebar';
import DashboardLayout from './components/Dashboard'; 
import Patients from './components/Patients'; 
import AddPatient from './components/AddPatient';
import Appointments from './components/Appointments';

// Dashboard Sub-Tabs (Real Functional Components)
import Overview from './components/dashboard/Overview';
import DoctorsTab from './components/dashboard/DoctorsTab';
import PatientsTab from './components/dashboard/PatientsTab';
import LabsTab from './components/dashboard/LabsTab';
import PharmacyTab from './components/dashboard/PharmacyTab';
import SettingsTab from './components/dashboard/SettingsTab';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 1. Check login status on page load
  useEffect(() => {
    const auth = localStorage.getItem('isAdmin');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 2. Logout Function
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to Logout?")) {
      localStorage.removeItem('isAdmin');
      setIsAuthenticated(false);
      window.location.href = '/'; // Redirect to login screen
    }
  };

  // --- Agar Login nahi hai to sirf Login Page dikhao ---
  if (!isAuthenticated) {
    return <Login setAuth={setIsAuthenticated} />;
  }

  // --- Agar Login hai to poora Hospital System dikhao ---
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar hamesha nazar aayega jab login hoga */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <Routes>
          {/* 1. Root Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 2. Dashboard Parent Route (With Nested Functional Tabs) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="doctors" element={<DoctorsTab />} />
            <Route path="patients" element={<PatientsTab />} />
            <Route path="labs" element={<LabsTab />} />
            <Route path="pharmacy" element={<PharmacyTab />} />
            <Route path="settings" element={<SettingsTab />} /> 
          </Route>

          {/* 3. Top-Level Sidebar Pages */}
          <Route path="/patients" element={<Patients />} />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/appointments" element={<Appointments />} />

          {/* 4. Professional 404 Fallback Page */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-full bg-white">
              <div className="text-center animate-in fade-in zoom-in duration-500">
                <h1 className="text-[150px] font-black text-gray-100 leading-none">404</h1>
                <div className="bg-blue-600 text-white px-4 py-1 rounded-lg font-black uppercase text-xs tracking-[5px] inline-block -mt-10 mb-8">
                  Page Not Found
                </div>
                <p className="text-gray-500 font-bold mb-8">Oops! The page you are looking for doesn't exist.</p>
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase italic tracking-tighter"
                >
                  Back to Safe Zone
                </button>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;