import express from "express";
import auth from "../middleware/auth.js";
import Post from "../models/Post.js";

const router = express.Router();

/** Krijo post (auth) */
router.post("/", auth, async (req, res) => {
  const { title, body, tags = [], published = true } = req.body;
  if (!title || !body) return res.status(400).json({ message: "Title dhe body kërkohen" });
  const post = await Post.create({
    author: req.userId,
    title,
    body,
    tags: Array.isArray(tags) ? tags : String(tags).split(",").map(s=>s.trim()).filter(Boolean),
    published
  });
  res.status(201).json(post);
});

/** Lista me filtra: ?q=&tags=mern,react&page=1&limit=10&author=id */
router.get("/", async (req, res) => {
  const { q, tags, author, page = 1, limit = 10, published = "true" } = req.query;
  const filter = {};
  if (published !== "all") filter.published = published === "true";
  if (q) filter.$text = { $search: q };
  if (author) filter.author = author;
  if (tags) {
    const arr = Array.isArray(tags) ? tags : String(tags).split(",").map(s=>s.trim()).filter(Boolean);
    if (arr.length) filter.tags = { $all: arr };
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate("author","name"),
    Post.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total/Number(limit)) });
});

/** Merr 1 post */
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author","name");
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

/** Përditëso (vetëm autori) */
router.put("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (String(post.author) !== req.userId) return res.status(403).json({ message: "Not owner" });

  const allowed = ["title","body","tags","published"];
  allowed.forEach(k => { if (k in req.body) post[k] = req.body[k]; });
  if (typeof post.tags === "string") post.tags = post.tags.split(",").map(s=>s.trim()).filter(Boolean);
  await post.save();
  res.json(post);
});

/** Fshi (vetëm autori) */
router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (String(post.author) !== req.userId) return res.status(403).json({ message: "Not owner" });
  await post.deleteOne();
  res.json({ ok: true });
});

/** Koment (auth) */
router.post("/:id/comments", auth, async (req, res) => {
  const { body } = req.body;
  if (!body || !body.trim()) return res.status(400).json({ message: "Comment body required" });
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  post.comments.push({ author: req.userId, body });
  await post.save();
  const populated = await Post.findById(post._id).populate("comments.author","name").populate("author","name");
  res.status(201).json(populated);
});

export default router;
