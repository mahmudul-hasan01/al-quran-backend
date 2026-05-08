// backend/models/Surah.js
import mongoose from "mongoose";

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

export default mongoose.model("Surah", surahSchema);
