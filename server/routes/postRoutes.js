// server/routes/postRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import Post from "../models/Post.js";

const router = express.Router();

/**
 * POST /api/posts
 * Krijon një post të ri (auth kërkohet)
 * Body: { title, body, tags?: string[] | "a,b", published?: boolean, coverUrl?: string }
 */
router.post("/", auth, async (req, res) => {
  const {
    title,
    body,
    tags = [],
    published = true,
    coverUrl = "",
  } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Title dhe body kërkohen" });
  }

  // Normalizo tags si array
  const arr = Array.isArray(tags)
    ? tags
    : String(tags)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const post = await Post.create({
    author: req.userId,
    title,
    body,
    tags: arr,
    published,
    coverUrl,
  });

  // Kthe me author të populluar që UI të ketë emrin menjëherë
  const populated = await Post.findById(post._id).populate("author", "name");
  res.status(201).json(populated);
});

/**
 * GET /api/posts
 * Lista me filtra:
 *  ?q=search&tags=a,b&author=<id>&page=1&limit=9&published=true|false|all
 */
router.get("/", async (req, res) => {
  const {
    q,
    tags,
    author,
    page = 1,
    limit = 9,
    published = "true",
  } = req.query;

  const filter = {};
  if (published !== "all") filter.published = published === "true";
  if (q) filter.$text = { $search: q };
  if (author) filter.author = author;
  if (tags) {
    const arr = Array.isArray(tags)
      ? tags
      : String(tags)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
    if (arr.length) filter.tags = { $all: arr };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("author", "name"),
    Post.countDocuments(filter),
  ]);

  res.json({
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

/**
 * GET /api/posts/:id
 * Merr një post (me author dhe komentuesit e populluar)
 */
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name")
    .populate("comments.author", "name");

  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

/**
 * PUT /api/posts/:id
 * Përditëson një post (vetëm autori)
 * Body lejohet: title, body, tags, published, coverUrl
 */
router.put("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (String(post.author) !== req.userId)
    return res.status(403).json({ message: "Not owner" });

  const allowed = ["title", "body", "tags", "published", "coverUrl"];
  for (const k of allowed) {
    if (k in req.body) post[k] = req.body[k];
  }

  if (typeof post.tags === "string") {
    post.tags = post.tags
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  await post.save();
  const populated = await Post.findById(post._id).populate("author", "name");
  res.json(populated);
});

/**
 * DELETE /api/posts/:id
 * Fshin një post (vetëm autori)
 */
router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (String(post.author) !== req.userId)
    return res.status(403).json({ message: "Not owner" });

  await post.deleteOne();
  res.json({ ok: true });
});

/**
 * POST /api/posts/:id/comments
 * Shton një koment te një post (auth)
 * Body: { body }
 */
router.post("/:id/comments", auth, async (req, res) => {
  const { body } = req.body;
  if (!body || !body.trim())
    return res.status(400).json({ message: "Comment body required" });

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.comments.push({ author: req.userId, body });
  await post.save();

  const populated = await Post.findById(post._id)
    .populate("author", "name")
    .populate("comments.author", "name");

  res.status(201).json(populated);
});

export default router;
