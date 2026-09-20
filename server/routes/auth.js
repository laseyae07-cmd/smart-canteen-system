const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router(); // Creates a mini-app for handling routes

// 1. REGISTER ROUTE (POST /api/auth/register)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
    });

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// 2. LOGIN ROUTE (POST /api/auth/login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password matches the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload (data inside the token)
      process.env.JWT_SECRET,            // Secret key to sign the token
      { expiresIn: '1d' }                // Token expires in 1 day
    );

    // Send the token and user data back to the frontend
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;