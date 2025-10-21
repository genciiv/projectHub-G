// server/models/User.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name:  { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    role: { type: String, enum: ["Freelancer", "Client"], default: "Freelancer", index: true },

    avatarUrl: { type: String, default: "" },
    bio:       { type: String, default: "", maxlength: 500 },

    following: [{ type: Schema.Types.ObjectId, ref: "User" }],          // ⇦ ndjekjet
    savedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],         // ⇦ saved
    savedProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],   // ⇦ saved
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", UserSchema);
