const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// تسجيل مستخدم جديد
router.post('/signup', async (req, res) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;

    // التحقق من وجود المستخدم بالفعل
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء مستخدم جديد
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      age,
    });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

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
