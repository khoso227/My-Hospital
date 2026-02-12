// src/Patients.jsx
import React, { useEffect, useState } from 'react';
import { getPatients, deletePatient } from './services/patientService';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await getPatients();
            setPatients(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Data fetch karne mein error:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Kya aap waqai is patient ko delete karna chahte hain?")) {
            await deletePatient(id);
            fetchPatients(); // List refresh karne ke liye
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="p-6">
                    <div className="flex justify-between mb-4">
                        <h1 className="text-2xl font-bold">Patient Management</h1>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">Add New Patient</button>
                    </div>

                    {loading ? <p>Loading...</p> : (
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 border">Name</th>
                                    <th className="p-3 border">Age</th>
                                    <th className="p-3 border">Gender</th>
                                    <th className="p-3 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map(patient => (
                                    <tr key={patient._id} className="text-center border-b">
                                        <td className="p-3 border">{patient.name}</td>
                                        <td className="p-3 border">{patient.age}</td>
                                        <td className="p-3 border">{patient.gender}</td>
                                        <td className="p-3 border">
                                            <button className="text-blue-500 mr-2">Edit</button>
                                            <button onClick={() => handleDelete(patient._id)} className="text-red-500">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Patients;