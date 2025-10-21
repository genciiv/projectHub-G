// server/routes/uploadRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs/promises";
import cloudinary from "../utils/cloudinary.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// multer temp storage
const upload = multer({ dest: "uploads/" });

// Ngarko në Cloudinary
router.post("/image", auth, upload.single("file"), async (req, res) => {
  try {
    const path = req.file.path;
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "projecthub/blog" },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      import("fs").then(fs => fs.createReadStream(path).pipe(stream));
    });
    await fs.unlink(path);
    res.json({ url: result.secure_url });
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ message: e.message });
  }
});

export default router;
