// backend/scripts/importData.js
const axios = require("axios");
const Surah = require("../models/Surah");
const Ayah = require("../models/Ayah");

const QURAN_API_BASE = "https://api.alquran.cloud/v1";

async function importQuranData() {
  try {
    console.log("Starting Quran data import...");

    // Clear existing data
    await Surah.deleteMany({});
    await Ayah.deleteMany({});
    console.log("Cleared existing data");

    // Import surahs list
    const surahsResponse = await axios.get(`${QURAN_API_BASE}/surah`);
    const surahs = surahsResponse.data.data;

    for (const surah of surahs) {
      await Surah.create({
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation,
        revelationType: surah.revelationType,
        numberOfAyahs: surah.numberOfAyahs,
        juz: Math.ceil(surah.numberOfAyahs / 7) || 1,
      });
      console.log(`Imported surah ${surah.number}: ${surah.englishName}`);
    }

    // Import ayahs for each surah
    for (let i = 1; i <= 114; i++) {
      try {
        const arabicResponse = await axios.get(
          `${QURAN_API_BASE}/surah/${i}/editions/quran-uthmani,en.sahih`,
        );
        const arabicAyahs = arabicResponse.data.data[0].ayahs;
        const translationAyahs = arabicResponse.data.data[1].ayahs;

        for (let j = 0; j < arabicAyahs.length; j++) {
          await Ayah.create({
            number: arabicAyahs[j].numberInSurah,
            surahNumber: i,
            text: arabicAyahs[j].text,
            translation: translationAyahs[j].text,
          });
        }
        console.log(`Imported ${arabicAyahs.length} ayahs for surah ${i}`);
      } catch (error) {
        console.error(`Error importing surah ${i}:`, error.message);
      }
    }

    console.log("Quran data import completed successfully!");
  } catch (error) {
    console.error("Import error:", error);
  }
}

module.exports = { importQuranData };
