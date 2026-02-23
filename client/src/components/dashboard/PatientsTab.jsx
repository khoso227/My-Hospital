import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Printer, Trash2, X, Plus, FileText } from 'lucide-react';

const PatientsTab = () => {
    const [patients, setPatients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLetterOpen, setIsLetterOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [formData, setFormData] = useState({ name: '', cell: '', disease: '', type: 'OPD', admissionDays: 0 });

    // DYNAMIC BRANDING: Settings se hospital ka naam uthana
    const hospitalName = localStorage.getItem('hospitalName') || 'HOSPITAL PRO';

    const fetchPatients = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/patients');
            if (res.data.success) setPatients(res.data.data);
        } catch (err) { console.log("Fetch Error:", err); }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/patients/status/${id}`, { status });
            fetchPatients();
        } catch (err) { alert("Status Update Failed"); }
    };

    const openPrintModal = (p) => {
        setSelectedPatient(p);
        setIsLetterOpen(true);
    };

    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8 bg-white p-8 rounded-[35px] shadow-sm border-b-4 border-teal-500">
                <h1 className="text-3xl font-black italic uppercase text-gray-800 tracking-tighter">Patient Lifecycle</h1>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                >
                    <UserPlus size={24}/> NEW REGISTRATION
                </button>
            </div>

            {/* Patients List Area */}
            <div className="grid grid-cols-1 gap-4">
                {patients.map(p => (
                    <div key={p._id} className="bg-white p-6 rounded-[35px] border-2 border-transparent hover:border-teal-100 shadow-sm flex items-center justify-between transition-all group">
                        <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center font-black text-xl shadow-inner ${p.type === 'Admit' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                {p.type === 'Admit' ? 'AD' : 'OP'}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-800">{p.name}</h3>
                                <div className="flex gap-3 mt-1">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{p.disease || 'General Case'}</span>
                                    <span className={`text-[10px] font-black uppercase px-2 rounded ${p.status === 'Active' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                                        {p.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {p.status === 'Active' ? (
                                <>
                                    <button onClick={() => handleStatusUpdate(p._id, 'Discharged')} className="bg-green-50 text-green-600 px-6 py-3 rounded-2xl text-[10px] font-black border border-green-100 hover:bg-green-600 hover:text-white transition-all uppercase">Discharge</button>
                                    <button onClick={() => handleStatusUpdate(p._id, 'Referred')} className="bg-orange-50 text-orange-600 px-6 py-3 rounded-2xl text-[10px] font-black border border-orange-100 hover:bg-orange-600 hover:text-white transition-all uppercase">Refer</button>
                                    <button onClick={() => handleStatusUpdate(p._id, 'Death')} className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black hover:bg-red-600 transition-all uppercase">Death</button>
                                </>
                            ) : (
                                <button onClick={() => openPrintModal(p)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all">
                                    <Printer size={16}/> PRINT {p.status} LETTER
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {patients.length === 0 && (
                    <div className="text-center py-20 text-gray-300 font-black italic uppercase tracking-widest">No Patients Found</div>
                )}
            </div>

            {/* Registration Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[50px] w-full max-w-lg p-12 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-black italic text-teal-700 uppercase border-b-4 border-teal-100 inline-block">Admission Form</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={30} className="text-gray-300 hover:text-black"/></button>
                        </div>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            await axios.post('http://localhost:5000/api/patients/add', formData);
                            setIsModalOpen(false); 
                            fetchPatients();
                        }} className="space-y-4">
                            <input placeholder="Patient Name" className="w-full border-2 p-5 rounded-3xl font-bold outline-none focus:border-teal-500" required onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input placeholder="Mobile / Cell" className="w-full border-2 p-5 rounded-3xl font-bold outline-none focus:border-teal-500" required onChange={e => setFormData({...formData, cell: e.target.value})} />
                            <input placeholder="Reason / Disease" className="w-full border-2 p-5 rounded-3xl font-bold outline-none focus:border-teal-500" onChange={e => setFormData({...formData, disease: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <select className="border-2 p-5 rounded-3xl font-bold bg-gray-50 outline-none" onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="OPD">OPD Visit</option>
                                    <option value="Admit">Ward Admission</option>
                                </select>
                                {formData.type === 'Admit' && (
                                    <input type="number" placeholder="Days Admit" className="border-2 p-5 rounded-3xl font-bold animate-in slide-in-from-left-2" onChange={e => setFormData({...formData, admissionDays: e.target.value})} />
                                )}
                            </div>
                            <button type="submit" className="w-full bg-teal-600 text-white py-6 rounded-[25px] font-black text-xl mt-6 shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all">SUBMIT RECORD</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Letter View Modal (Merged with Dynamic Branding) */}
            {isLetterOpen && (
                <div className="fixed inset-0 bg-white z-[100] p-10 overflow-y-auto">
                    <div className="max-w-4xl mx-auto border-[15px] border-double border-gray-100 p-16 relative bg-white shadow-2xl">
                        <button onClick={() => setIsLetterOpen(false)} className="absolute top-5 right-5 text-red-500 font-black no-print uppercase underline cursor-pointer">Close Preview</button>
                        
                        {/* Merged Header Section */}
                        <div className="text-center mb-16">
                            <h1 className="text-6xl font-black tracking-tighter text-blue-900 mb-2 italic uppercase">
                                {hospitalName}
                            </h1>
                            <div className="h-1 w-32 bg-teal-500 mx-auto mb-4"></div>
                            <p className="font-bold uppercase tracking-[0.3em] text-gray-400 text-sm">
                                Official {selectedPatient?.status} Certificate
                            </p>
                        </div>

                        <div className="space-y-10 text-2xl text-gray-700 leading-relaxed font-serif italic">
                            <p>To whom it may concern,</p>
                            <p>This is to officially certify that Patient <strong className="border-b-2 border-black px-4 uppercase text-black font-sans not-italic">{selectedPatient?.name}</strong> 
                            who was registered under ID <strong className="px-2 text-black font-sans not-italic">#{selectedPatient?._id.slice(-6)}</strong> for <strong>{selectedPatient?.disease || 'Medical Treatment'}</strong> 
                            has reached the lifecycle status of <strong className="text-red-600 underline uppercase font-sans not-italic">{selectedPatient?.status}</strong>.</p>
                            
                            <p className="text-lg">
                                Case Details: {selectedPatient?.type === 'Admit' ? `Stay Duration: ${selectedPatient?.admissionDays} Days in Admission Ward.` : 'OPD Consultation Visit.'}
                            </p>
                            
                            <div className="pt-20 flex justify-between items-end">
                                <div className="text-center">
                                    <div className="w-64 h-[2px] bg-black mb-2"></div>
                                    <p className="font-black text-xs uppercase tracking-widest text-black">Medical Superintendent</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">{hospitalName} Management</p>
                                </div>
                                <div className="text-right text-[10px] font-black text-gray-300 uppercase">
                                    Generated On: {new Date().toLocaleString()} <br/>
                                    System Verified Document
                                </div>
                            </div>
                        </div>

                        {/* Print Button */}
                        <div className="mt-20 no-print flex gap-4 justify-center">
                            <button 
                                onClick={() => window.print()} 
                                className="bg-blue-900 text-white px-16 py-6 rounded-[30px] font-black text-xl shadow-2xl hover:scale-105 transition-all flex items-center gap-3"
                            >
                                <Printer /> PRINT CERTIFICATE
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientsTab;