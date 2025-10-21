// server/routes/postRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import Post from "../models/Post.js";

const router = express.Router();

// Krijo post
router.post("/", auth, async (req, res) => {
  const { title, body, tags = [], published = true, coverUrl = "" } = req.body;
  const arr = Array.isArray(tags)
    ? tags
    : String(tags).split(",").map((s) => s.trim()).filter(Boolean);

  const post = await Post.create({
    author: req.userId,
    title,
    body,
    tags: arr,
    published,
    coverUrl,
  });

  const populated = await Post.findById(post._id).populate("author", "name");
  res.status(201).json(populated);
});

// Merr lista postimesh
router.get("/", async (req, res) => {
  const { q, author, page = 1, limit = 9 } = req.query;
  const filter = {};
  if (author) filter.author = author;
  if (q) filter.$text = { $search: q };

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("author", "name"),
    Post.countDocuments(filter),
  ]);

  res.json({ items, total });
});

// Merr një post
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name")
    .populate("comments.author", "name");
  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
});

// Përditëso
router.put("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });
  if (String(post.author) !== req.userId)
    return res.status(403).json({ message: "Jo pronar" });

  Object.assign(post, req.body);
  await post.save();
  const populated = await Post.findById(post._id).populate("author", "name");
  res.json(populated);
});

// Fshi
router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });
  if (String(post.author) !== req.userId)
    return res.status(403).json({ message: "Jo pronar" });
  await post.deleteOne();
  res.json({ ok: true });
});

// Koment
router.post("/:id/comments", auth, async (req, res) => {
  const { body } = req.body;
  if (!body) return res.status(400).json({ message: "Comment required" });
  const post = await Post.findById(req.params.id);
  post.comments.push({ author: req.userId, body });
  await post.save();
  const populated = await Post.findById(post._id).populate("comments.author", "name");
  res.status(201).json(populated);
});

export default router;
