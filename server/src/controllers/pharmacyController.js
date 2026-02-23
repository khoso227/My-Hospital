// server/src/controllers/pharmacyController.js
const PharmacyInventory = require('../models/PharmacyInventory.js.js');
const PharmacyDispensation = require('../models/PharmacyDispensation.js');
const Billing = require('../models/Billing');

// 1. Add new medicine to inventory
exports.addMedicine = async (req, res) => {
  try {
    const newMedicine = new PharmacyInventory(req.body);
    await newMedicine.save();
    res.status(201).json({ success: true, data: newMedicine });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 2. Get all inventory (with low stock & expiry alerts)
exports.getInventory = async (req, res) => {
  try {
    const inventory = await PharmacyInventory.find()
      .sort({ expiryDate: 1 });

    const lowStock = inventory.filter(item => item.stock < 10);
    const nearExpiry = inventory.filter(item => 
      item.expiryDate && item.expiryDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );

    res.json({
      success: true,
      inventory,
      lowStock,
      nearExpiry
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Dispense medicine + link to billing
exports.dispenseMedicine = async (req, res) => {
  const { medicineId, patientId, quantity, notes } = req.body;

  try {
    const medicine = await PharmacyInventory.findById(medicineId);
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
    if (medicine.stock < quantity) return res.status(400).json({ success: false, message: 'Insufficient stock' });

    medicine.stock -= quantity;
    await medicine.save();

    const dispensation = new PharmacyDispensation({
      medicine: medicineId,
      patient: patientId,
      quantity,
      dispensedBy: req.user?._id || null, // agar auth middleware hai to
      notes,
    });
    await dispensation.save();

    // Billing create
    const billAmount = quantity * medicine.price;
    const billing = new Billing({
      patient: patientId,
      amount: billAmount,
      items: [{ name: medicine.medicineName, price: medicine.price, quantity }],
      status: 'Pending'
    });
    await billing.save();

    dispensation.billing = billing._id;
    await dispensation.save();

    res.json({ success: true, dispensation, billing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Generate Reports (yeh wala sabse important hai jo tum use kar rahe ho)
exports.getPharmacyReports = async (req, res) => {
  const { reportType = 'overview', startDate, endDate } = req.query;

  try {
    let reportData = {};

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (reportType === 'overview' || reportType === 'stock') {
      const inventory = await PharmacyInventory.find().sort({ expiryDate: 1 });

      const lowStock = inventory.filter(item => item.stock < 10);
      const nearExpiry = inventory.filter(item => 
        item.expiryDate && item.expiryDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      );

      reportData.stockOverview = {
        totalMedicines: inventory.length,
        totalStockValue: inventory.reduce((sum, item) => sum + (item.stock * item.price), 0),
        lowStockCount: lowStock.length,
        nearExpiryCount: nearExpiry.length,
        lowStockItems: lowStock.map(i => ({ name: i.medicineName, stock: i.stock, expiry: i.expiryDate?.toISOString().split('T')[0] })),
        nearExpiryItems: nearExpiry.map(i => ({ name: i.medicineName, expiry: i.expiryDate?.toISOString().split('T')[0] }))
      };
    }

    if (reportType === 'overview' || reportType === 'dispensed' || reportType === 'sales') {
      const match = { ...dateFilter };

      const dispensed = await PharmacyDispensation.aggregate([
        { $match: match },
        {
          $lookup: {
            from: 'pharmacyinventories',
            localField: 'medicine',
            foreignField: '_id',
            as: 'medicineDetails'
          }
        },
        { $unwind: '$medicineDetails' },
        {
          $group: {
            _id: '$medicineDetails.medicineName',
            totalDispensed: { $sum: '$quantity' },
            totalRevenue: { $sum: { $multiply: ['$quantity', '$medicineDetails.price'] } },
            lastDispensed: { $max: '$createdAt' }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ]);

      reportData.dispensedReport = {
        totalDispensedItems: dispensed.reduce((sum, d) => sum + d.totalDispensed, 0),
        totalRevenue: dispensed.reduce((sum, d) => sum + d.totalRevenue, 0),
        topMedicines: dispensed.slice(0, 10),
        period: startDate && endDate ? `${startDate} to ${endDate}` : 'All Time'
      };
    }

    if (reportType === 'expiry') {
      const nearExpiry = await PharmacyInventory.find({
        expiryDate: { $lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
      }).sort({ expiryDate: 1 });

      reportData.expiryReport = {
        nearExpiryCount: nearExpiry.length,
        items: nearExpiry.map(item => ({
          name: item.medicineName,
          batch: item.batchNumber,
          expiry: item.expiryDate?.toISOString().split('T')[0],
          stock: item.stock
        }))
      };
    }

    res.json({ success: true, ...reportData });
  } catch (err) {
    console.error('Report Error:', err);
    res.status(500).json({ success: false, message: 'Error generating report', error: err.message });
  }
};