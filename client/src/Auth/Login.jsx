import React from 'react';
import { Mail, Lock, Activity } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[30px] shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <Activity className="text-white w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">MediSaaS Pro</h2>
          <p className="text-slate-400">Hospital Management SaaS</p>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm text-slate-300 ml-1">Email</label>
            <input type="email" placeholder="doctor@hospital.com" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-300 ml-1">Password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;