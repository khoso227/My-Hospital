const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/', doctorController.getDoctors);
router.post('/add', doctorController.addDoctor); // Yeh line zaroori hai
router.delete('/:id', doctorController.deleteDoctor); // Delete function ke liye

module.exports = router;