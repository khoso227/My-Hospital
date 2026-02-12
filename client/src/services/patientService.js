import axios from 'axios';

const API_URL = 'http://localhost:5000/api/patients';

// Token hasil karne ka function (Local Storage se)
const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Check karein aapka login kis naam se token save karta hai
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const getPatients = async () => {
    return await axios.get(API_URL, getAuthHeaders());
};

export const addPatient = async (patientData) => {
    return await axios.post(API_URL, patientData, getAuthHeaders());
};

export const deletePatient = async (id) => {
    return await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};