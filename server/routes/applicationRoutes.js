import express from "express";
import Application from "../models/Application.js";
import Project from "../models/Project.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/** Apliko në një projekt */
router.post("/:projectId/apply", auth, async (req, res) => {
  try {
    const { coverLetter, bidAmount, etaDays } = req.body;
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (String(project.owner) === req.userId)
      return res.status(400).json({ message: "Owner can't apply" });
    if (project.status !== "open")
      return res.status(400).json({ message: "Project not open" });

    const app = await Application.create({
      project: project._id,
      applicant: req.userId,
      coverLetter,
      bidAmount,
      etaDays,
    });
    res.status(201).json(app);
  } catch (e) {
    // Shfaq gabim unik (nëse ka aplikuar një herë)
    if (e.code === 11000)
      return res.status(400).json({ message: "Already applied" });
    res.status(500).json({ message: e.message });
  }
});

/** Lista e aplikimeve të një projekti (vetëm owner) */
router.get("/:projectId/apps", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (String(project.owner) !== req.userId)
      return res.status(403).json({ message: "Not owner" });

    const apps = await Application.find({ project: project._id })
      .sort({ createdAt: -1 })
      .populate("applicant", "name email role");
    res.json(apps);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
