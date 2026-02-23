import React from 'react';

const Login = () => {
  const handleFakeLogin = (e) => {
    e.preventDefault();
    // Bina kisi check ke token set kar rahe hain
    localStorage.setItem('token', 'development-token');
    localStorage.setItem('role', 'admin');
    
    // Page ko refresh karke dashboard par bhejna
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center w-96">
        <h1 className="text-4xl font-black text-blue-600 mb-4">HOSPITAL PRO</h1>
        <p className="text-gray-500 mb-8 font-medium">Development Mode: Active</p>
        
        <form onSubmit={handleFakeLogin}>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-xl hover:bg-blue-700 shadow-lg transition-all active:scale-95"
          >
            Enter Dashboard 🚀
          </button>
        </form>
        
        <p className="mt-6 text-xs text-gray-400 uppercase tracking-widest">
          No Password Required
        </p>
      </div>
    </div>
  );
};

export default Login;