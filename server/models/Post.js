// server/models/Post.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body:   { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const PostSchema = new Schema(
  {
    author:   { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title:    { type: String, required: true, trim: true },
    body:     { type: String, required: true },
    tags:     [{ type: String }],
    published:{ type: Boolean, default: true },
    coverUrl: { type: String, default: "" },
    likes:    [{ type: Schema.Types.ObjectId, ref: "User" }], // ⇦
    comments: [CommentSchema],
  },
  { timestamps: true }
);

PostSchema.index({ title: "text", body: "text", tags: "text" });

export default mongoose.model("Post", PostSchema);
