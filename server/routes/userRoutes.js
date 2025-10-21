// server/routes/userRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Project from "../models/Project.js";

const router = express.Router();

/**
 * GET /api/users/:id
 * Profil publik (pa password)
 */
router.get("/:id", async (req, res) => {
  const u = await User.findById(req.params.id).select("name email role avatarUrl bio createdAt");
  if (!u) return res.status(404).json({ message: "User not found" });
  res.json(u);
});

/**
 * PUT /api/users/:id
 * Përditësim profili (vetëm pronari)
 */
router.put("/:id", auth, async (req, res) => {
  if (req.userId !== req.params.id) {
    return res.status(403).json({ message: "Not allowed" });
  }
  const allowed = ["name", "bio", "avatarUrl"];
  const update = {};
  for (const k of allowed) if (k in req.body) update[k] = req.body[k];

  const u = await User.findByIdAndUpdate(req.params.id, update, { new: true })
    .select("name email role avatarUrl bio createdAt");
  res.json(u);
});

/**
 * DELETE /api/users/:id
 * Fshirje llogarie (vetëm pronari) + fshin postet/projektet
 */
router.delete("/:id", auth, async (req, res) => {
  if (req.userId !== req.params.id) {
    return res.status(403).json({ message: "Not allowed" });
  }
  await Promise.all([
    Post.deleteMany({ author: req.params.id }),
    Project.deleteMany({ owner: req.params.id }),
  ]);
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
