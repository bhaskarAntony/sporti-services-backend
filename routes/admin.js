const express = require('express');
const User = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const secret = '133a889e51573dae5d1f527089e91a3c3c4d547490c4e762bd6a3416905a11c811e8c93bdf9a2cac853ae8c6ed89890deff99826d67b469d758667bc26d9df45';

// Register route
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '1h' });
      

            // Set the token as a cookie
            res.cookie('token', token, { 
            HttpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // Secure cookies only in production
            sameSite: 'Strict' // Protect against cross-site request forgery
            });
            res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
