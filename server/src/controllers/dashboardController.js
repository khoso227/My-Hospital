const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Medicine = require('../models/Medicine');

exports.getStats = async (req, res) => {
    try {
        // 1. Doctors Count
        const drTotal = await Doctor.countDocuments();
        const drAvail = await Doctor.countDocuments({ timings: { $exists: true } }); // Example logic

        // 2. Active Patients (Jo Admit hain ya Active hain)
        const ptActive = await Patient.countDocuments({ status: 'Active' });

        // 3. Revenue Calculation (Pharmacy ki sales se)
        const medicines = await Medicine.find();
        const totalRevenue = medicines.reduce((acc, med) => acc + (med.price * med.stock), 0);

        // 4. Low Stock Alert
        const lowStockCount = await Medicine.countDocuments({ stock: { $lt: 10 } });

        res.json({
            success: true,
            data: {
                drTotal,
                drAvail,
                ptActive,
                revenue: totalRevenue,
                lowStock: lowStockCount,
                chartData: [
                    { name: 'Mon', revenue: totalRevenue * 0.1 },
                    { name: 'Tue', revenue: totalRevenue * 0.2 },
                    { name: 'Wed', revenue: totalRevenue * 0.15 },
                    { name: 'Thu', revenue: totalRevenue * 0.25 },
                    { name: 'Fri', revenue: totalRevenue * 0.3 }
                ]
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};