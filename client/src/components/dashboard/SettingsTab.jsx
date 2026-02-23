import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Save, Building2 } from 'lucide-react';

const SettingsTab = () => {
    const [hospitalName, setHospitalName] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/settings').then(res => {
            if(res.data.success) {
                setHospitalName(res.data.data.hospitalName);
                setAddress(res.data.data.address);
                // LocalStorage mein save karein taake bina refresh ke har jagah update ho jaye
                localStorage.setItem('hospitalName', res.data.data.hospitalName);
            }
        });
    }, []);

    const handleSave = async () => {
        const res = await axios.put('http://localhost:5000/api/settings/update', { hospitalName, address });
        if(res.data.success) {
            localStorage.setItem('hospitalName', hospitalName);
            alert("Hospital Brand Updated! Refreshing...");
            window.location.reload();
        }
    };

    return (
        <div className="p-10 max-w-2xl mx-auto">
            <div className="bg-white p-10 rounded-[50px] shadow-xl border-t-8 border-blue-600">
                <div className="flex items-center gap-4 mb-8">
                    <Settings className="text-blue-600" size={32} />
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">White-Label Settings</h1>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Your Hospital Name</label>
                        <input 
                            value={hospitalName} 
                            onChange={(e) => setHospitalName(e.target.value)}
                            className="w-full border-2 p-5 rounded-3xl font-black text-xl outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Location / Address</label>
                        <input 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border-2 p-5 rounded-3xl font-bold outline-none focus:border-blue-500"
                        />
                    </div>
                    <button onClick={handleSave} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-100 uppercase italic">
                        <Save size={20}/> Save Hospital Brand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;