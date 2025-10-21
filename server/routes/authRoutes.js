import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "Freelancer" } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Ju lutem plotësoni të gjitha fushat." });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Ky email është regjistruar tashmë." });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hash, role });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Gabim gjatë regjistrimit." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Plotësoni të gjitha fushat." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Përdoruesi nuk u gjet." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Fjalëkalimi është i pasaktë." });

    // ✅ Krijo JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Vendos cookie (kështu ruhet sesioni)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax", // punon në localhost
      secure: false, // true vetëm në HTTPS prod
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ditë
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Gabim gjatë hyrjes." });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ message: "Doli me sukses." });
});

// ME (verifikon token nga cookie)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "Nuk u gjet përdoruesi." });
    res.json(user);
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: "Gabim gjatë marrjes së të dhënave." });
  }
});

export default router;
