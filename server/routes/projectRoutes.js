// server/routes/projectRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import Project from "../models/Project.js";

const router = express.Router();

// Shto projekt
router.post("/", auth, async (req, res) => {
  const p = await Project.create({ ...req.body, owner: req.userId });
  const populated = await Project.findById(p._id).populate("owner", "name");
  res.status(201).json(populated);
});

// Merr lista projektesh
router.get("/", async (req, res) => {
  const { owner, page = 1, limit = 12 } = req.query;
  const filter = {};
  if (owner) filter.owner = owner;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Project.find(filter)
      .populate("owner", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Project.countDocuments(filter),
  ]);
  res.json({ items, total });
});

// Merr një projekt
router.get("/:id", async (req, res) => {
  const p = await Project.findById(req.params.id).populate("owner", "name");
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
});

// Përditëso
router.put("/:id", auth, async (req, res) => {
  const p = await Project.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  if (String(p.owner) !== req.userId)
    return res.status(403).json({ message: "Jo pronar" });
  Object.assign(p, req.body);
  await p.save();
  res.json(await Project.findById(p._id).populate("owner", "name"));
});

// Fshi
router.delete("/:id", auth, async (req, res) => {
  const p = await Project.findById(req.params.id);
  if (!p) return res.status(404).json({ message: "Not found" });
  if (String(p.owner) !== req.userId)
    return res.status(403).json({ message: "Jo pronar" });
  await p.deleteOne();
  res.json({ ok: true });
});

export default router;
