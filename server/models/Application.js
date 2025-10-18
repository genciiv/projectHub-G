import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Types.ObjectId, ref: "Project", required: true },
    applicant: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String, required: true },
    bidAmount: { type: Number, required: true },
    etaDays: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "rejected", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

ApplicationSchema.index({ project: 1, applicant: 1 }, { unique: true }); // 1 aplikim per user per projekt

export default mongoose.model("Application", ApplicationSchema);
