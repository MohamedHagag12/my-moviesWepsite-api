const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  imgUrl: { type: String, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieID: { type: String, required: true },
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
