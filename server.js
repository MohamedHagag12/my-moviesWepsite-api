require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// تشغيل السيرفر
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
