import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 180 },
  body: { type: String, required: true, trim: true, maxlength: 20000 },
  tags: { type: [String], default: [], index: true },
  comments: { type: [CommentSchema], default: [] },
  published: { type: Boolean, default: true, index: true }
}, { timestamps: true });

PostSchema.index({ title: "text", body: "text" });

export default mongoose.model("Post", PostSchema);
