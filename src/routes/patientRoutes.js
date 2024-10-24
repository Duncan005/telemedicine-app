const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Patient registration route
router.post('/register', patientController.registerPatient);

// Patient login route
router.post('/login', patientController.loginPatient);

module.exports = router;
