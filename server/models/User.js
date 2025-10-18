import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["client", "freelancer", "admin"],
      default: "freelancer",
    },
    avatarUrl: String,
    bio: String,
    skills: [String],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
