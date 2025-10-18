// server/models/Project.js
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, required: true, trim: true },
    budgetMin: { type: Number, default: 0, min: 0 },
    budgetMax: { type: Number, default: 0, min: 0 },
    skills: { type: [String], default: [], index: true }, // index normal (JO text)
    deadline: { type: Date },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed", "cancelled"],
      default: "open",
      index: true,
    },
    winner: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Text index vetëm për fushat string (OK me Fast Text Search)
ProjectSchema.index({ title: "text", description: "text" });

// Normalize + guard i vogël për buxhetet/skills
ProjectSchema.pre("save", function (next) {
  if (this.budgetMax && this.budgetMin > this.budgetMax) {
    [this.budgetMin, this.budgetMax] = [this.budgetMax, this.budgetMin];
  }
  this.skills = (this.skills || [])
    .map((s) => String(s).trim())
    .filter(Boolean);
  next();
});

export default mongoose.model("Project", ProjectSchema);
