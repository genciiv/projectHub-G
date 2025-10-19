import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Application from "../models/Application.js";

const router = express.Router();

/** Projektet e mia (si client/owner) */
router.get("/me/projects", auth, async (req, res) => {
  const items = await Project.find({ owner: req.userId })
    .sort({ createdAt: -1 })
    .select("_id title status budgetMin budgetMax skills createdAt winner");
  res.json(items);
});

/** Aplikimet e mia (si freelancer) me të dhënat e projektit */
router.get("/me/applications", auth, async (req, res) => {
  const apps = await Application.find({ applicant: req.userId })
    .sort({ createdAt: -1 })
    .populate("project", "title status budgetMin budgetMax owner")
    .select("_id project coverLetter bidAmount etaDays status createdAt");
  res.json(apps);
});

/** Përditëso profilin (pa ndryshuar rolin) */
router.put("/me", auth, async (req, res) => {
  const allowed = ["name", "bio", "avatarUrl", "skills"];
  const patch = {};
  for (const k of allowed) if (k in req.body) patch[k] = req.body[k];

  // Normalizim i skills: prano string “a, b, c” ose array
  if (typeof patch.skills === "string") {
    patch.skills = patch.skills
      .split(",")
      .map((s) => String(s).trim())
      .filter(Boolean);
  }

  const user = await User.findByIdAndUpdate(req.userId, patch, {
    new: true,
  }).select("-passwordHash");
  res.json(user);
});

export default router;
