// server/routes/authRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
// Përdor bcryptjs në Windows / Node 22 për instalim më të lehtë
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Helpers
function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",   // përdor "none" + secure:true në prod me HTTPS
    secure: false,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ditë
  });
}

/**
 * POST /api/auth/register
 * Body: { name, email, password, role? }
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "Freelancer" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Plotëso emrin, emailin dhe fjalëkalimin." });
    }

    // Validim i role
    const allowedRoles = ["Freelancer", "Client"];
    const safeRole = allowedRoles.includes(role) ? role : "Freelancer";

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ message: "Ky email është i regjistruar." });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
      role: safeRole,
    });

    // opsionale: auto-login
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    setAuthCookie(res, token);

    res.status(201).json({ id: user._id, name: user.name, role: user.role });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Gabim serveri" });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase().trim() });
    if (!user) return res.status(400).json({ message: "Kredenciale të pasakta." });

    const ok = await bcrypt.compare(password || "", user.password);
    if (!ok) return res.status(401).json({ message: "Kredenciale të pasakta." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    setAuthCookie(res, token);

    res.json({ id: user._id, name: user.name, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Gabim serveri" });
  }
});

/**
 * GET /api/auth/me
 * Kthen user-in aktual (nga cookie)
 */
router.get("/me", auth, async (req, res) => {
  const me = await User.findById(req.userId).select("name email role avatarUrl bio");
  res.json(me);
});

/**
 * POST /api/auth/logout
 * Pastron cookie-n
 */
router.post("/logout", async (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
  res.json({ ok: true });
});

export default router;
