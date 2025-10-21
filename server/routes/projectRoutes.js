import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import Project from "../models/Project.js";

const router = express.Router();

/**
 * POST /api/projects
 * Krijo projekt (owner = user i loguar)
 */
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, budget = 0, skills = [], coverUrl = "" } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Titulli dhe përshkrimi janë të detyrueshëm." });
    }

    const skillsArr = Array.isArray(skills)
      ? skills
      : String(skills).split(",").map(s => s.trim()).filter(Boolean);

    const prj = await Project.create({
      owner: req.userId,
      title,
      description,
      budget: Number(budget) || 0,
      skills: skillsArr,
      coverUrl,
    });

    const populated = await Project.findById(prj._id).populate("owner", "name avatarUrl");
    res.status(201).json(populated);
  } catch (e) {
    console.error("Create project error:", e);
    res.status(500).json({ message: "Gabim serveri gjatë krijimit të projektit." });
  }
});

/**
 * GET /api/projects
 * Listim me filtro: ?owner=... ose ?q=...  + pagination (page, limit)
 * Gjithmonë 200 me {items, total, page} — kurrë 404 për listë bosh.
 */
router.get("/", async (req, res) => {
  try {
    const { owner, q, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (owner) filter.owner = owner;
    if (q) filter.$text = { $search: q };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Project.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("owner", "name avatarUrl"),
      Project.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page) });
  } catch (e) {
    console.error("List projects error:", e);
    res.status(500).json({ message: "Gabim serveri gjatë listimit të projekteve." });
  }
});

/**
 * GET /api/projects/:id
 * Merr një projekt me id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID e pavlefshme." });
    }
    const prj = await Project.findById(id).populate("owner", "name avatarUrl");
    if (!prj) return res.status(404).json({ message: "Nuk u gjet projekti." });
    res.json(prj);
  } catch (e) {
    console.error("Get project error:", e);
    res.status(500).json({ message: "Gabim serveri gjatë marrjes së projektit." });
  }
});

/**
 * PUT /api/projects/:id
 * Përditëso (vetëm pronari)
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID e pavlefshme." });
    }
    const prj = await Project.findById(id);
    if (!prj) return res.status(404).json({ message: "Nuk u gjet projekti." });
    if (String(prj.owner) !== req.userId) {
      return res.status(403).json({ message: "Nuk je pronar i këtij projekti." });
    }

    const allowed = ["title", "description", "budget", "skills", "coverUrl"];
    for (const k of allowed) {
      if (k in req.body) {
        if (k === "skills") {
          prj.skills = Array.isArray(req.body.skills)
            ? req.body.skills
            : String(req.body.skills).split(",").map(s => s.trim()).filter(Boolean);
        } else if (k === "budget") {
          prj.budget = Number(req.body.budget) || 0;
        } else {
          prj[k] = req.body[k];
        }
      }
    }
    await prj.save();
    const populated = await Project.findById(prj._id).populate("owner", "name avatarUrl");
    res.json(populated);
  } catch (e) {
    console.error("Update project error:", e);
    res.status(500).json({ message: "Gabim serveri gjatë përditësimit të projektit." });
  }
});

/**
 * DELETE /api/projects/:id
 * Fshi (vetëm pronari)
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID e pavlefshme." });
    }
    const prj = await Project.findById(id);
    if (!prj) return res.status(404).json({ message: "Nuk u gjet projekti." });
    if (String(prj.owner) !== req.userId) {
      return res.status(403).json({ message: "Nuk je pronar i këtij projekti." });
    }
    await prj.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    console.error("Delete project error:", e);
    res.status(500).json({ message: "Gabim serveri gjatë fshirjes së projektit." });
  }
});

/**
 * POST /api/projects/:id/like
 * LIKE/UNLIKE toggle
 */
router.post("/:id/like", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID e pavlefshme." });
    }
    const prj = await Project.findById(id).select("likes");
    if (!prj) return res.status(404).json({ message: "Nuk u gjet projekti." });

    const me = req.userId;
    const has = prj.likes.map(String).includes(String(me));
    if (has) prj.likes.pull(me);
    else prj.likes.addToSet(me);
    await prj.save();

    res.json({ liked: !has, likesCount: prj.likes.length });
  } catch (e) {
    console.error("Like project error:", e);
    res.status(500).json({ message: "Gabim serveri gjatë like/unlike." });
  }
});

export default router;
