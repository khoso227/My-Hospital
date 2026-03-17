import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User, Eye, EyeOff, ShieldCheck, Mail } from 'lucide-react';

const Login = ({ setAuth }) => {
    const [view, setView] = useState('login'); // login or register
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = view === 'login' ? 'login' : 'register';
            const res = await axios.post(`https://my-hospital-odec.vercel.app/api/auth/${url}`, formData);

            if (res.data.success) {
                if (view === 'login') {
                    // Store token and user data
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    localStorage.setItem('role', res.data.user.role);
                    localStorage.setItem('isAdmin', 'true');
                    setAuth(true);
                } else {
                    alert("Account Created! Please login.");
                    setView('login');
                    setFormData({ name: '', email: '', password: '', role: 'admin' });
                }
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Server Error!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-slate-900 flex items-center justify-center p-4 font-sans">
            <div className="bg-white w-full max-w-md rounded-[50px] p-10 shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">
                        {view === 'login' ? 'Hospital Login' : 'Create Account'}
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Hospital Pro SaaS Management</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {view === 'register' && (
                        <div className="relative">
                            <User className="absolute left-4 top-4 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                        <input
                            type={showPass ? "text" : "password"}
                            placeholder="Password"
                            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-blue-600"
                        >
                            {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                        </button>
                    </div>

                    {view === 'register' && (
                        <div className="relative">
                            <select
                                className="w-full pl-4 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="admin">Admin</option>
                                <option value="doctor">Doctor</option>
                                <option value="patient">Patient</option>
                            </select>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase italic disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (view === 'login' ? 'Login' : 'Register')}
                    </button>
                </form>

                <div className="mt-8 flex flex-col gap-2 text-center">
                    {view === 'login' ? (
                        <button
                            type="button"
                            onClick={() => setView('register')}
                            className="text-[10px] font-black text-gray-400 uppercase hover:text-blue-600"
                        >
                            Create New Account
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setView('login')}
                            className="text-[10px] font-black text-gray-400 uppercase hover:text-blue-600"
                        >
                            Already have account? Login
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;