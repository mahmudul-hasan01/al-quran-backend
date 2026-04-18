// backend/routes/quranRoutes.js
const express = require("express");
const router = express.Router();
const Surah = require("../models/Surah");
const Ayah = require("../models/Ayah");

// Get all surahs
router.get("/surahs", async (req, res) => {
  try {
    const surahs = await Surah.find().sort({ number: 1 });
    res.json(surahs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single surah by number
router.get("/surahs/:number", async (req, res) => {
  try {
    const surah = await Surah.findOne({ number: req.params.number });
    if (!surah) {
      return res.status(404).json({ error: "Surah not found" });
    }
    res.json(surah);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all ayahs for a specific surah
router.get("/ayahs/:surahNumber", async (req, res) => {
  try {
    const ayahs = await Ayah.find({ surahNumber: req.params.surahNumber }).sort(
      { number: 1 },
    );
    res.json(ayahs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single ayah
router.get("/ayah/:surahNumber/:ayahNumber", async (req, res) => {
  try {
    const ayah = await Ayah.findOne({
      surahNumber: req.params.surahNumber,
      number: req.params.ayahNumber,
    });
    if (!ayah) {
      return res.status(404).json({ error: "Ayah not found" });
    }
    res.json(ayah);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search ayahs by translation text
router.get("/search", async (req, res) => {
  try {
    const { q, limit = 50 } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const results = await Ayah.find({
      translation: { $regex: q, $options: "i" },
    })
      .limit(parseInt(limit))
      .sort({ surahNumber: 1, number: 1 });

    // Get surah info for each result
    const surahs = await Surah.find();
    const surahMap = {};
    surahs.forEach((s) => {
      surahMap[s.number] = s;
    });

    const enrichedResults = results.map((ayah) => ({
      ...ayah.toObject(),
      surahInfo: surahMap[ayah.surahNumber],
    }));

    res.json(enrichedResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get surah info with all ayahs (combined)
router.get("/surah-full/:surahNumber", async (req, res) => {
  try {
    const surah = await Surah.findOne({ number: req.params.surahNumber });
    if (!surah) {
      return res.status(404).json({ error: "Surah not found" });
    }

    const ayahs = await Ayah.find({ surahNumber: req.params.surahNumber }).sort(
      { number: 1 },
    );

    res.json({
      surah,
      ayahs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
