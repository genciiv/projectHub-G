// server/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

// Modelet (për syncIndexes)
import Project from "./models/Project.js";

// Rrugët
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware bazë
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173", // frontendi yt
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check (test)
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "projecthub-api",
    time: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", applicationRoutes);
app.use("/api/users", userRoutes);

// MongoDB + Server start
const PORT = process.env.PORT || 5000;
const URI = process.env.MONGODB_URI;

try {
  await mongoose.connect(URI, { dbName: "projecthub" });
  console.log("✅ MongoDB connected successfully");

  // Fshij index-et e vjetra dhe krijo të rejat
  await Project.syncIndexes();
  console.log("✅ Project indexes synced");

  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
} catch (err) {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
}
