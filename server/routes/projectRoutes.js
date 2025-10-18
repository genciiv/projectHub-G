import express from "express";
import Project from "../models/Project.js";
import Application from "../models/Application.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/** Krijo projekt (owner = useri që poston) */
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      budgetMin,
      budgetMax,
      skills = [],
      deadline,
    } = req.body;
    if (!title || !description)
      return res
        .status(400)
        .json({ message: "Title dhe description janë të detyrueshme" });

    const project = await Project.create({
      owner: req.userId,
      title,
      description,
      budgetMin: Number(budgetMin) || 0,
      budgetMax: Number(budgetMax) || 0,
      skills,
      deadline: deadline ? new Date(deadline) : undefined,
    });
    res.status(201).json(project);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/** Lista me filtra: ?q=&skills=react,node&min=100&max=1000&status=open */
router.get("/", async (req, res) => {
  try {
    const {
      q,
      skills,
      min,
      max,
      status,
      owner,
      page = 1,
      limit = 12,
    } = req.query;
    const filter = {};

    if (q) filter.$text = { $search: q };
    if (status) filter.status = status;
    if (owner) filter.owner = owner;

    if (skills) {
      const arr = Array.isArray(skills)
        ? skills
        : String(skills)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
      if (arr.length) filter.skills = { $all: arr };
    }
    if (min || max) {
      filter.$and = [
        ...(filter.$and || []),
        { budgetMax: { $gte: Number(min || 0) } },
        { budgetMin: { $lte: Number(max || 1e12) } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const cursor = Project.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const [items, total] = await Promise.all([
      cursor,
      Project.countDocuments(filter),
    ]);
    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/** Merr një projekt */
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "owner",
      "name email role"
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/** Përditëso (vetëm owner) */
router.put("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (String(project.owner) !== req.userId)
      return res.status(403).json({ message: "Not owner" });

    const allowed = [
      "title",
      "description",
      "budgetMin",
      "budgetMax",
      "skills",
      "deadline",
      "status",
    ];
    allowed.forEach((k) => {
      if (k in req.body) project[k] = req.body[k];
    });
    await project.save();
    res.json(project);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/** Zgjidh fituesin (owner) */
router.post("/:id/winner", auth, async (req, res) => {
  try {
    const { applicantId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (String(project.owner) !== req.userId)
      return res.status(403).json({ message: "Not owner" });

    const app = await Application.findOne({
      project: project._id,
      applicant: applicantId,
      status: "pending",
    });
    if (!app)
      return res
        .status(400)
        .json({ message: "Application not found or not pending" });

    app.status = "accepted";
    await app.save();
    project.winner = applicantId;
    project.status = "in_progress";
    await project.save();

    res.json({
      message: "Winner set",
      projectId: project._id,
      winner: applicantId,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
