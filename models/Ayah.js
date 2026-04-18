// backend/models/Ayah.js
const mongoose = require("mongoose");

const ayahSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  surahNumber: { type: Number, required: true, index: true },
  text: { type: String, required: true },
  translation: { type: String, required: true },
});

// Compound index for unique ayah within surah
ayahSchema.index({ surahNumber: 1, number: 1 }, { unique: true });

module.exports = mongoose.model("Ayah", ayahSchema);
