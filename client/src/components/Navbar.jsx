import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => { 
    localStorage.clear(); 
    navigate('/login'); 
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // RTL Setup for Urdu/Sindhi: Poora layout flip ho jayega
    document.documentElement.dir = (lng === 'ur' || lng === 'sd') ? 'rtl' : 'ltr';
    // Font change (Optional: Urdu ke liye Noto Nastaliq behtar lagta hai)
    if (lng === 'ur' || lng === 'sd') {
      document.body.style.fontFamily = "'Noto Nastaliq Urdu', serif";
    } else {
      document.body.style.fontFamily = "inherit";
    }
  };

  return (
    <header className="bg-blue-800 text-white p-4 flex justify-between items-center shadow-lg px-8 sticky top-0 z-[100]">
      {/* Logo & Main Nav */}
      <div className="flex items-center gap-8">
        <h2 className="font-black text-xl tracking-tighter uppercase text-blue-200">
          {t('hospital_name')}
        </h2>
        <div className="hidden md:flex gap-6 font-bold text-sm uppercase tracking-widest">
          <Link to="/dashboard" className="hover:text-blue-300 transition">{t('dashboard')}</Link>
          <Link to="/patients" className="hover:text-blue-300 transition">{t('patients')}</Link>
          <Link to="/appointments" className="hover:text-blue-300 transition">{t('appointments')}</Link>
        </div>
      </div>

      {/* Language Buttons & Logout */}
      <div className="flex items-center gap-4">
        <div className="flex bg-blue-900/50 p-1 rounded-xl border border-blue-700">
          <button 
            onClick={() => changeLanguage('en')} 
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition ${i18n.language === 'en' ? 'bg-blue-600 shadow-md' : 'hover:bg-blue-800'}`}
          >
            EN
          </button>
          <button 
            onClick={() => changeLanguage('ur')} 
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition ${i18n.language === 'ur' ? 'bg-green-600 shadow-md' : 'hover:bg-blue-800'}`}
          >
            اردو
          </button>
          <button 
            onClick={() => changeLanguage('sd')} 
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition ${i18n.language === 'sd' ? 'bg-red-600 shadow-md' : 'hover:bg-blue-800'}`}
          >
            سنڌي
          </button>
        </div>
        
        <button 
          onClick={handleLogout} 
          className="bg-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase shadow-lg hover:bg-red-700 transition"
        >
          {t('logout')}
        </button>
      </div>
    </header>
  );
};

export default Navbar;