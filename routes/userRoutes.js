const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// تسجيل مستخدم جديد
router.post('/signup', async (req, res) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        message: 'This email is already registered. You can sign in instead.',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      age,
    });
    await newUser.save();

    res.status(201).json({ message: 'Account created successfully!' });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while signing up. Please try again later.',
    });
  }
});

// تسجيل الدخول
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// جلب جميع المستخدمين (مع التحقق من التوكن)
router.get('/getAllUsers', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ message: 'success', users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
