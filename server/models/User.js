import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    profilePic: { type: String, default: "" },
    bio: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
