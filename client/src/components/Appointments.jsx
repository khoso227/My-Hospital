import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Plus } from 'lucide-react';

const Appointments = () => {
  const initialDoctors = [
    { 
      id: 1, name: "Dr. Gm Khoso", specialist: "Neurologist", 
      fees: "1500", days: "Mon - Thu", time: "11:00 AM - 05:00 PM",
      image: "👨‍⚕️" 
    },
    { 
      id: 2, name: "Dr. Ahmed Ali", specialist: "Cardiologist", 
      fees: "2000", days: "Mon, Wed, Fri", time: "06:00 PM - 09:00 PM",
      image: "👨‍⚕️" 
    },
    { 
      id: 3, name: "Dr. Sara Khan", specialist: "Gynecologist", 
      fees: "1200", days: "Daily", time: "10:00 AM - 02:00 PM",
      image: "👩‍⚕️" 
    }
  ];

  const [doctors, setDoctors] = useState(initialDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({ name: '', mobile: '', address: '' });
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialist: '',
    fees: '',
    days: '',
    time: '',
    image: '👨‍⚕️'
  });
  const [editingId, setEditingId] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const resetDoctorForm = () => {
    setDoctorForm({ name: '', specialist: '', fees: '', days: '', time: '', image: '👨‍⚕️' });
    setEditingId(null);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedDoctor) return alert("Pehle Doctor select karein!");
    
    alert(`Appointment Booked Successfully!\nPatient: ${formData.name}\nDoctor: ${selectedDoctor.name}\nFees: Rs. ${selectedDoctor.fees}`);
    setFormData({ name: '', mobile: '', address: '' });
    setSelectedDoctor(null);
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    if (!doctorForm.name || !doctorForm.specialist) return;

    if (editingId) {
      const updated = doctors.map(doc =>
        doc.id === editingId ? { ...doc, ...doctorForm } : doc
      );
      setDoctors(updated);
      const updatedSelected = updated.find(d => d.id === selectedDoctor?.id);
      setSelectedDoctor(updatedSelected || null);
    } else {
      const newDoc = { id: Date.now(), ...doctorForm };
      setDoctors(prev => [...prev, newDoc]);
    }
    resetDoctorForm();
  };

  const handleDoctorEdit = (doc) => {
    setDoctorForm({ ...doc });
    setEditingId(doc.id);
    setMenuOpenId(null);
  };

  const handleDoctorDelete = (id) => {
    const doc = doctors.find(d => d.id === id);
    if (!doc) return;
    if (!window.confirm(`Delete ${doc.name}?`)) return;
    const remaining = doctors.filter(d => d.id !== id);
    setDoctors(remaining);
    if (selectedDoctor?.id === id) setSelectedDoctor(null);
    if (editingId === id) resetDoctorForm();
    setMenuOpenId(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-black text-blue-900 mb-2 uppercase tracking-tighter">Book Appointment</h2>
        <p className="text-gray-400 font-bold mb-10 uppercase text-xs tracking-widest">Select a doctor and fill patient details</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT: DOCTORS LIST + MANAGEMENT */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-black text-xl text-gray-700 mb-4">Available Doctors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`relative p-6 rounded-[35px] border-4 transition-all cursor-pointer shadow-sm ${
                    selectedDoctor?.id === doc.id ? 'border-blue-600 bg-blue-50' : 'border-white bg-white hover:border-blue-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === doc.id ? null : doc.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 focus:outline-none border border-blue-100"
                    aria-label="Doctor actions"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {menuOpenId === doc.id && (
                    <div className="absolute top-12 right-4 bg-white shadow-xl rounded-2xl border border-gray-100 z-10 w-36">
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50"
                        onClick={(e) => { e.stopPropagation(); handleDoctorEdit(doc); }}
                      >
                        <Edit2 size={14} /> Edit
                      </button>
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={(e) => { e.stopPropagation(); handleDoctorDelete(doc.id); }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <span className="text-4xl bg-blue-100 p-3 rounded-2xl">{doc.image}</span>
                    <div>
                      <h4 className="font-black text-lg text-gray-800">{doc.name}</h4>
                      <p className="text-blue-500 font-bold text-xs uppercase">{doc.specialist}</p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Consultation Fee</span>
                      <span className="font-black text-green-600">Rs. {doc.fees}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Available Days</span>
                      <span className="font-bold text-gray-700">{doc.days}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Timings</span>
                      <span className="font-bold text-gray-700">{doc.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Doctor Management Form */}
            <div className="bg-white rounded-3xl border border-blue-100 p-6 mt-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <div>
                  <h4 className="font-black text-lg text-gray-800">Manage Doctors</h4>
                  <p className="text-[11px] uppercase text-gray-400 font-bold tracking-wide">
                    Add new doctor or edit existing
                  </p>
                </div>
              </div>
              <form onSubmit={handleDoctorSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none font-semibold"
                  placeholder="Full name"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  required
                />
                <input
                  className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none font-semibold"
                  placeholder="Specialist (e.g. Cardiologist)"
                  value={doctorForm.specialist}
                  onChange={(e) => setDoctorForm({ ...doctorForm, specialist: e.target.value })}
                  required
                />
                <input
                  className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none font-semibold"
                  placeholder="Fees (Rs.)"
                  value={doctorForm.fees}
                  onChange={(e) => setDoctorForm({ ...doctorForm, fees: e.target.value })}
                  required
                />
                <input
                  className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none font-semibold"
                  placeholder="Available days (e.g. Mon - Thu)"
                  value={doctorForm.days}
                  onChange={(e) => setDoctorForm({ ...doctorForm, days: e.target.value })}
                  required
                />
                <input
                  className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none font-semibold"
                  placeholder="Timing (e.g. 10:00 AM - 02:00 PM)"
                  value={doctorForm.time}
                  onChange={(e) => setDoctorForm({ ...doctorForm, time: e.target.value })}
                  required
                />
                <input
                  className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none font-semibold"
                  placeholder="Emoji / Icon (e.g. 👨‍⚕️)"
                  value={doctorForm.image}
                  onChange={(e) => setDoctorForm({ ...doctorForm, image: e.target.value })}
                />

                <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-wide shadow hover:bg-blue-800 active:scale-95"
                  >
                    {editingId ? 'Update Doctor' : 'Add Doctor'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetDoctorForm}
                      className="px-6 py-3 rounded-2xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-100 active:scale-95"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT: BOOKING FORM */}
          <div className="bg-white p-8 rounded-[40px] shadow-2xl h-fit sticky top-10 border border-blue-50">
            <h3 className="font-black text-2xl text-blue-800 mb-6 uppercase tracking-tighter">Patient Details</h3>
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Patient Full Name</label>
                <input 
                  type="text" required
                  className="w-full p-4 mt-1 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold"
                  placeholder="Enter patient name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Mobile Number</label>
                <input 
                  type="text" required
                  className="w-full p-4 mt-1 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold"
                  placeholder="03xx-xxxxxxx"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Current Address</label>
                <textarea 
                  required
                  className="w-full p-4 mt-1 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold h-24"
                  placeholder="Street, City..."
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              {selectedDoctor && (
                <div className="bg-blue-600 p-4 rounded-2xl text-white">
                  <p className="text-[10px] font-bold uppercase opacity-80">Selected Doctor:</p>
                  <p className="font-black">{selectedDoctor.name}</p>
                  <div className="flex justify-between mt-2 pt-2 border-t border-blue-400">
                    <span className="text-xs">Payable Fees:</span>
                    <span className="font-black">Rs. {selectedDoctor.fees}</span>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-blue-800 text-white py-5 rounded-[25px] font-black text-lg shadow-xl hover:bg-black transition-all transform active:scale-95"
              >
                BOOK APPOINTMENT ✅
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Appointments;
