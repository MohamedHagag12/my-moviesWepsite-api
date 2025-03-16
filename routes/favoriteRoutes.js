const express = require('express');
const Favorite = require('../models/Favorite');
const jwt = require('jsonwebtoken');

const router = express.Router();

// إضافة فيلم للمفضلة
router.post('/addToFavorites', async (req, res) => {
  try {
    const { movieName, imgUrl, userID, movieID, token } = req.body;

    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: 'Unauthorized' });

    const newFavorite = new Favorite({ movieName, imgUrl, userID, movieID });
    await newFavorite.save();

    res.status(201).json({ message: 'Movie added to favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// جلب قائمة المفضلة لمستخدم معين
router.get('/getFavorites/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const favorites = await Favorite.find({ userID });

    res.json({ message: 'success', favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
