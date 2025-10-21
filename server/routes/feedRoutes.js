// server/routes/feedRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import Friend from "../models/Friend.js";
import Post from "../models/Post.js";
import Project from "../models/Project.js";

const router = express.Router();

// Feed (miqtë + vetja)
router.get("/", auth, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const rels = await Friend.find({
    $or: [{ from: req.userId }, { to: req.userId }],
    status: "accepted",
  });
  const friendIds = rels.map(r =>
    String(r.from) === req.userId ? r.to : r.from
  );

  const ids = [req.userId, ...friendIds];

  const [posts, projects] = await Promise.all([
    Post.find({ author: { $in: ids }, published: true })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 2),
    Project.find({ owner: { $in: ids } })
      .populate("owner", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 2),
  ]);

  const merged = [
    ...posts.map(p => ({ _id: p._id, type: "post", createdAt: p.createdAt, data: p })),
    ...projects.map(p => ({ _id: p._id, type: "project", createdAt: p.createdAt, data: p })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const items = merged.slice(skip, skip + Number(limit));
  res.json({ items, total: merged.length });
});

export default router;
