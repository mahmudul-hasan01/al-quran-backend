import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import quranRoutes from "./routes/quranRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["https://al-quran-snowy.vercel.app", "http://localhost:3000"],
  }),
);

app.use(express.json());

// Routes
app.use("/api", quranRoutes);

app.get("/", (req, res) => {
  res.send("Quran API running...");
});

const PORT = process.env.PORT || 5000;

// MongoDB Connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log("❌ MongoDB connection error:", error);
  }
};

startServer();
