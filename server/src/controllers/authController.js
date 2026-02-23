const Admin = require('../models/Admin');

// 1. Create Account
exports.register = async (req, res) => {
    try {
        const { username, password, recoveryKey } = req.body;
        const existing = await Admin.findOne({ username });
        if (existing) return res.json({ success: false, message: "Admin already exists!" });

        const newAdmin = new Admin({ username, password, recoveryKey });
        await newAdmin.save();
        res.json({ success: true, message: "Admin Account Created!" });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// 2. Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username, password });
        if (admin) res.json({ success: true, admin });
        else res.json({ success: false, message: "Invalid Credentials!" });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// 3. Recovery (Forget Password)
exports.recoverPassword = async (req, res) => {
    try {
        const { username, recoveryKey } = req.body;
        const admin = await Admin.findOne({ username, recoveryKey });
        if (admin) res.json({ success: true, password: admin.password });
        else res.json({ success: false, message: "Wrong Recovery Key!" });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};