import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import cloudinary from "../utils/cloudinary.js";
import stream from "stream";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/uploads/image
 * Form-Data: file (image)
 * Return: { url }
 */
router.post("/image", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Krijo një stream dhe dërgo drejt Cloudinary
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    const result = await new Promise((resolve, reject) => {
      const cld = cloudinary.uploader.upload_stream(
        {
          folder: "projecthub/blog",
          resource_type: "image",
          transformation: [{ width: 1600, crop: "limit" }], // limit madhësinë
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      bufferStream.pipe(cld);
    });

    res.json({ url: result.secure_url });
  } catch (e) {
    console.error("Upload error:", e);
    res.status(500).json({ message: e.message });
  }
});

export default router;
