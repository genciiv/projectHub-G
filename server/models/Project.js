// server/models/Project.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    owner:      { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title:      { type: String, required: true, trim: true },
    description:{ type: String, required: true },
    budget:     { type: Number, default: 0 },
    skills:     [{ type: String }],
    coverUrl:   { type: String, default: "" },
    likes:      [{ type: Schema.Types.ObjectId, ref: "User" }], // ⇦
  },
  { timestamps: true }
);

ProjectSchema.index({ title: "text", description: "text", skills: "text" });

export default mongoose.model("Project", ProjectSchema);
