// backend/routes/quranRoutes.js
const express = require("express");
const router = express.Router();
const Surah = require("../models/Surah");

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Get all surahs (without verses)
router.get("/surahs", async (req, res) => {
  try {
    const surahs = await Surah.find({}, { verses: 0 }).sort({ id: 1 });
    res.json(surahs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single surah by number (without verses)
router.get("/surahs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { q } = req.query;

    const surah = await Surah.findById(id).lean();

    if (!surah) {
      return res.status(404).json({ error: "Surah not found" });
    }

    if (q && q.trim() !== "") {
      const regex = new RegExp(escapeRegex(q.trim()), "i");
      const verses = surah.verses.filter(
        (v) => v.translation && regex.test(v.translation),
      );
      return res.json({ ...surah, verses });
    }

    res.json(surah);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
