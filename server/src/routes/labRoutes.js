const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController');

router.get('/', labController.getLabs);
router.post('/add', labController.addLab);

module.exports = router;