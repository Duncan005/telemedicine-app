const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register patient
exports.registerPatient = async (req, res) => {
    const { name, email, password } = req.body;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO patients (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error registering patient' });
        }
        res.status(201).json({ message: 'Patient registered successfully!' });
    });
};

// Login patient
exports.loginPatient = (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM patients WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error logging in' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const patient = results[0];
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: patient.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};
