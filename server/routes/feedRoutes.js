// server/routes/feedRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Project from "../models/Project.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const me = await User.findById(req.userId).select("following");
  const scope = [...me.following.map(String), String(req.userId)]; // miqtë + vetja

  const [posts, projects] = await Promise.all([
    Post.find({ author: { $in: scope } })
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("author", "name avatarUrl")
      .lean()
      .then(arr => arr.map(x => ({ ...x, _type: "post" }))),
    Project.find({ owner: { $in: scope } })
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("owner", "name avatarUrl")
      .lean()
      .then(arr => arr.map(x => ({ ...x, _type: "project" }))),
  ]);

  const merged = [...posts, ...projects].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const items = merged.slice(skip, skip + limit);
  res.json({ items, page, total: merged.length });
});

export default router;
