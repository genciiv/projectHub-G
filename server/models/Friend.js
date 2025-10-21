// server/models/Friend.js
import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  to:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending", index: true },
}, { timestamps: true });

FriendSchema.index({ from: 1, to: 1 }, { unique: true });

export default mongoose.model("Friend", FriendSchema);
