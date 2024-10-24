const express = require('express');
const session = require('express-session');
const db = require('../config/db');
const patientRoutes = require('./routes/patientRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Patient routes
app.use('/patients', patientRoutes);

// Example of a protected route
app.get('/protected', authMiddleware, (req, res) => {
    res.send(`Hello, user with ID: ${req.userId}`);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
