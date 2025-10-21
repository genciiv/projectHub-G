// server/routes/socialRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// FOLLOW
router.post("/follow/:id", auth, async (req, res) => {
  const me = req.userId;
  const target = req.params.id;
  if (me === target) return res.status(400).json({ message: "S’mund të ndjekësh veten." });

  await User.updateOne(
    { _id: me, following: { $ne: target } },
    { $addToSet: { following: target } }
  );

  const updated = await User.findById(me).select("name avatarUrl following");
  res.json(updated);
});

// UNFOLLOW
router.delete("/follow/:id", auth, async (req, res) => {
  const me = req.userId;
  const target = req.params.id;
  await User.updateOne({ _id: me }, { $pull: { following: target } });
  const updated = await User.findById(me).select("name avatarUrl following");
  res.json(updated);
});

// SUGGESTED users (të cilët nuk i ndjek)
router.get("/suggested", auth, async (req, res) => {
  const me = await User.findById(req.userId).select("following");
  const exclude = new Set([req.userId, ...me.following.map(String)]);
  const limit = Number(req.query.limit || 6);

  const suggested = await User.find({ _id: { $nin: Array.from(exclude) } })
    .select("name avatarUrl role")
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json(suggested);
});

export default router;
