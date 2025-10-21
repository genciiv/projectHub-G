// server/routes/friendRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import Friend from "../models/Friend.js";

const router = express.Router();

// Kërkesë miqësie
router.post("/request", auth, async (req, res) => {
  const { toUserId } = req.body;
  if (toUserId === req.userId)
    return res.status(400).json({ message: "Nuk mund t’i dërgoni vetes." });

  const inverse = await Friend.findOne({ from: toUserId, to: req.userId });
  if (inverse && inverse.status === "pending") {
    inverse.status = "accepted";
    await inverse.save();
    return res.json(inverse);
  }

  const f = await Friend.findOneAndUpdate(
    { from: req.userId, to: toUserId },
    { $setOnInsert: { status: "pending" } },
    { new: true, upsert: true }
  );
  res.status(201).json(f);
});

// Prano
router.post("/:id/accept", auth, async (req, res) => {
  const fr = await Friend.findById(req.params.id);
  if (!fr) return res.status(404).json({ message: "Not found" });
  if (String(fr.to) !== req.userId)
    return res.status(403).json({ message: "Not allowed" });
  fr.status = "accepted";
  await fr.save();
  res.json(fr);
});

// Hiq
router.delete("/:id", auth, async (req, res) => {
  const fr = await Friend.findById(req.params.id);
  if (!fr) return res.status(404).json({ message: "Not found" });
  if (String(fr.to) !== req.userId && String(fr.from) !== req.userId)
    return res.status(403).json({ message: "Not allowed" });
  await fr.deleteOne();
  res.json({ ok: true });
});

// Lista miqve
router.get("/", auth, async (req, res) => {
  const rels = await Friend.find({
    $or: [{ from: req.userId }, { to: req.userId }],
    status: "accepted",
  }).populate("from to", "name");
  const friends = rels.map(r => String(r.from._id) === req.userId ? r.to : r.from);
  res.json(friends);
});

// Kërkesat që kam marrë
router.get("/requests", auth, async (req, res) => {
  const pending = await Friend.find({ to: req.userId, status: "pending" })
    .populate("from", "name");
  res.json(pending);
});

// Statusi me një user
router.get("/status/:otherId", auth, async (req, res) => {
  const { otherId } = req.params;
  const rel = await Friend.findOne({
    $or: [
      { from: req.userId, to: otherId },
      { from: otherId, to: req.userId },
    ],
  });
  res.json(rel || null);
});

export default router;
