const express = require('express');
const router = express.Router();
const { addStaff, getStaff, deleteStaff } = require('../controllers/staffController');

// All Staff Endpoints
router.get('/all', getStaff);           
router.post('/add', addStaff);          
router.delete('/delete/:id', deleteStaff); 

module.exports = router;