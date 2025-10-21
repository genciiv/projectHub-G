// server/server.js
import "dotenv/config.js";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

// Routes
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import feedRoutes from "./routes/feedRoutes.js";     // <= importo NJË herë
import socialRoutes from "./routes/socialRoutes.js"; // <= importo NJË herë

const app = express();

// ----- Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ----- DB
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI mungon në .env");
  process.exit(1);
}
mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ----- Routes (vendosi një herë secilin)
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feed", feedRoutes);       // <= mos e përsërit
app.use("/api/social", socialRoutes);   // <= mos e përsërit

// Health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ----- Error fallback
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Gabim serveri." });
});

// ----- Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
