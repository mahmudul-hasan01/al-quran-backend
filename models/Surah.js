// backend/models/Surah.js
const mongoose = require("mongoose");

const surahSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  englishName: { type: String, required: true },
  englishNameTranslation: { type: String },
  revelationType: { type: String, enum: ["Meccan", "Medinan"], required: true },
  numberOfAyahs: { type: Number, required: true },
  juz: { type: Number, required: true },
});

module.exports = mongoose.model("Surah", surahSchema);
