import express from "express";
import auth from "../middleware/auth.js";
import Review from "../models/Review.js";
import Project from "../models/Project.js";

const router = express.Router();

// Krijo një review (vetëm pas përfundimit të projektit)
router.post("/", auth, async (req, res) => {
  const { projectId, to, rating, comment } = req.body;

  const project = await Project.findById(projectId);
  if (!project || project.status !== "completed")
    return res.status(400).json({ message: "Project not completed yet." });

  const review = await Review.create({
    project: projectId,
    from: req.userId,
    to,
    rating,
    comment,
  });

  res.status(201).json(review);
});

// Merr vlerësimet e një përdoruesi
router.get("/user/:id", async (req, res) => {
  const reviews = await Review.find({ to: req.params.id })
    .populate("from", "name")
    .sort({ createdAt: -1 });
  res.json(reviews);
});

export default router;
