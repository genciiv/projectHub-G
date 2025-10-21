// server/routes/postRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const router = express.Router();

// CREATE
router.post("/", auth, async (req, res) => {
  try {
    const { title, body, tags = [], published = true, coverUrl = "" } = req.body;
    if (!title || !body) return res.status(400).json({ message: "Titulli dhe përmbajtja janë të detyrueshme." });

    const arr = Array.isArray(tags) ? tags : String(tags).split(",").map(s=>s.trim()).filter(Boolean);
    const post = await Post.create({ author: req.userId, title, body, tags: arr, published, coverUrl });

    const populated = await Post.findById(post._id).populate("author", "name avatarUrl");
    res.status(201).json(populated);
  } catch (e) {
    console.error("Create post error:", e);
    res.status(500).json({ message: "Gabim serveri gjatë krijimit." });
  }
});

// LIST
router.get("/", async (req, res) => {
  try {
    const { q, author, page = 1, limit = 9 } = req.query;
    const filter = {};
    if (author) filter.author = author;
    if (q) filter.$text = { $search: q };

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate("author", "name avatarUrl"),
      Post.countDocuments(filter),
    ]);

    res.json({ items, total, page: Number(page) });
  } catch (e) {
    console.error("List posts error:", e);
    res.status(500).json({ message: "Gabim serveri gjatë listimit." });
  }
});

// GET ONE
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID e pavlefshme." });

    const post = await Post.findById(id)
      .populate("author", "name avatarUrl")
      .populate("comments.author", "name avatarUrl");
    if (!post) return res.status(404).json({ message: "Not found" });
    res.json(post);
  } catch (e) {
    console.error("Get post error:", e);
    res.status(500).json({ message: "Gabim serveri gjatë marrjes së postit." });
  }
});

// UPDATE (owner)
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID e pavlefshme." });
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Not found" });
    if (String(post.author) !== req.userId) return res.status(403).json({ message: "Jo pronar" });

    const allowed = ["title", "body", "tags", "published", "coverUrl"];
    for (const k of allowed) {
      if (k in req.body) {
        if (k === "tags") {
          post.tags = Array.isArray(req.body.tags)
            ? req.body.tags
            : String(req.body.tags).split(",").map(s => s.trim()).filter(Boolean);
        } else {
          post[k] = req.body[k];
        }
      }
    }
    await post.save();
    const populated = await Post.findById(post._id).populate("author", "name avatarUrl");
    res.json(populated);
  } catch (e) {
    console.error("Update post error:", e);
    res.status(500).json({ message: "Gabim serveri gjatë përditësimit." });
  }
});

// DELETE (owner)
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID e pavlefshme." });
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Not found" });
    if (String(post.author) !== req.userId) return res.status(403).json({ message: "Jo pronar" });

    await post.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    console.error("Delete post error:", e);
    res.status(500).json({ message: "Gabim serveri gjatë fshirjes." });
  }
});

// COMMENT
router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID e pavlefshme." });
    if (!body) return res.status(400).json({ message: "Koment i zbrazët." });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Not found" });

    post.comments.push({ author: req.userId, body });
    await post.save();
    const populated = await Post.findById(post._id).populate("comments.author", "name avatarUrl");
    res.status(201).json(populated);
  } catch (e) {
    console.error("Add comment error:", e);
    res.status(500).json({ message: "Gabim serveri gjatë komentimit." });
  }
});

// LIKE toggle
router.post("/:id/like", auth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID e pavlefshme." });
  const post = await Post.findById(id).select("likes");
  if (!post) return res.status(404).json({ message: "Not found" });

  const me = req.userId;
  const has = post.likes.map(String).includes(String(me));
  if (has) post.likes.pull(me);
  else post.likes.addToSet(me);
  await post.save();

  res.json({ liked: !has, likesCount: post.likes.length });
});

// SAVE toggle (në User)
router.post("/:id/save", auth, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID e pavlefshme." });

  const me = await User.findById(req.userId).select("savedPosts");
  const has = me.savedPosts.map(String).includes(String(id));
  if (has) me.savedPosts.pull(id);
  else me.savedPosts.addToSet(id);
  await me.save();

  res.json({ saved: !has });
});

export default router;
