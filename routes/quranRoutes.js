// backend/routes/quranRoutes.js

import express from "express";
import Surah from "../models/Surah.js";

const router = express.Router();

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Get all surahs
router.get("/surahs", async (req, res) => {
  const { q } = req.query;

  try {
    if (q) {
      const regex = new RegExp(escapeRegex(q.trim()), "i");

      const surahs = await Surah.find(
        {
          $or: [
            { name: regex },
            { transliteration: regex },
            { translation: regex },
          ],
        },
        { verses: 0 },
      ).sort({ id: 1 });

      return res.json(surahs);
    }

    const surahs = await Surah.find({}, { verses: 0 }).sort({ id: 1 });
    res.json(surahs);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Get single surah
router.get("/surahs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { q } = req.query;

    const surah = await Surah.findOne({ id }).lean();

    if (!surah) {
      return res.status(404).json({
        error: "Surah not found",
      });
    }

    if (q && q.trim() !== "") {
      const regex = new RegExp(escapeRegex(q.trim()), "i");

      const verses = surah.verses.filter(
        (v) => regex.test(v.translation || "") || regex.test(v.text || ""),
      );

      return res.json({
        ...surah,
        verses,
      });
    }

    res.json(surah);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
