import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User, Eye, EyeOff, ShieldCheck, Key } from 'lucide-react';

const Login = ({ setAuth }) => {
    const [view, setView] = useState('login'); // login, register, recover
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', recoveryKey: '' });
    const [recoveredPass, setRecoveredPass] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        let url = view === 'login' ? 'login' : view === 'register' ? 'register' : 'recover';
        
        try {
            const res = await axios.post(`http://localhost:5000/api/auth/${url}`, formData);
            if (res.data.success) {
                if (view === 'login') {
                    localStorage.setItem('isAdmin', 'true');
                    setAuth(true);
                } else if (view === 'recover') {
                    setRecoveredPass(res.data.password);
                } else {
                    alert("Account Created! Now Login.");
                    setView('login');
                }
            } else {
                alert(res.data.message);
            }
        } catch (err) { alert("Server Error!"); }
    };

    return (
        <div className="h-screen w-full bg-slate-900 flex items-center justify-center p-4 font-sans">
            <div className="bg-white w-full max-w-md rounded-[50px] p-10 shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">
                        {view === 'login' ? 'Admin Login' : view === 'register' ? 'Create Admin' : 'Recovery'}
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Hospital Pro SaaS Management</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-4 text-gray-400" size={20} />
                        <input 
                            placeholder="Admin Username" 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold"
                            onChange={(e) => setFormData({...formData, username: e.target.value})} required
                        />
                    </div>

                    {view !== 'recover' && (
                        <div className="relative">
                            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                            <input 
                                type={showPass ? "text" : "password"} 
                                placeholder="Password" 
                                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold"
                                onChange={(e) => setFormData({...formData, password: e.target.value})} required
                            />
                            <button 
                                type="button" onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-blue-600"
                            >
                                {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </button>
                        </div>
                    )}

                    {(view === 'register' || view === 'recover') && (
                        <div className="relative">
                            <Key className="absolute left-4 top-4 text-gray-400" size={20} />
                            <input 
                                placeholder="Secret Recovery Key" 
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-500 outline-none font-bold"
                                onChange={(e) => setFormData({...formData, recoveryKey: e.target.value})} required
                            />
                        </div>
                    )}

                    {recoveredPass && (
                        <div className="p-4 bg-green-50 rounded-2xl border-2 border-green-200 text-center">
                            <p className="text-[10px] font-black text-green-600 uppercase">Your Password is:</p>
                            <h2 className="text-xl font-black text-slate-800 tracking-widest">{recoveredPass}</h2>
                        </div>
                    )}

                    <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase italic">
                        {view === 'login' ? 'Enter Dashboard' : view === 'register' ? 'Register Admin' : 'Recover Now'}
                    </button>
                </form>

                <div className="mt-8 flex flex-col gap-2 text-center">
                    {view === 'login' ? (
                        <>
                            <button onClick={() => setView('recover')} className="text-[10px] font-black text-gray-400 uppercase hover:text-blue-600">Forgot Password?</button>
                            <button onClick={() => setView('register')} className="text-[10px] font-black text-blue-600 uppercase">Create New Admin Account</button>
                        </>
                    ) : (
                        <button onClick={() => {setView('login'); setRecoveredPass('');}} className="text-[10px] font-black text-gray-400 uppercase hover:text-blue-600">Back to Login</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;