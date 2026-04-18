// backend/models/Surah.js
const mongoose = require("mongoose");

const verseSchema = new mongoose.Schema(
  {
    id: Number,
    text: String,
    translation: String,
  },
  { _id: false },
);

const surahSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: String,
  transliteration: String,
  translation: String,
  type: String,
  total_verses: Number,
  verses: [verseSchema],
});

module.exports = mongoose.model("Surah", surahSchema);
