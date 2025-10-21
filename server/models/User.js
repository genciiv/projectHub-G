// server/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    // ⇩ Roli i përdoruesit
    role: { type: String, enum: ["Freelancer", "Client"], default: "Freelancer", index: true },

    // (opsionale) fusha profili
    avatarUrl: { type: String, default: "" },
    bio:       { type: String, default: "", maxlength: 500 },
  },
  { timestamps: true }
);

// Index për kërkim të shpejtë
UserSchema.index({ email: 1 }, { unique: true });

// Hiq password kur dërgohet në JSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", UserSchema);
