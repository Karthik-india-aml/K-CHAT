import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";


// signup
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.json({ success: false });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    email,
    password: hashed,
    bio,
  });

  res.json({
    success: true,
    userData: user,
    token: generateToken(user._id),
  });
};

// login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.json({ success: false });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.json({ success: false });

  res.json({
    success: true,
    userData: user,
    token: generateToken(user._id),
  });
};

// check auth
export const checkAuth = (req, res) =>
  res.json({ success: true, user: req.user });

// update profile
export const updateProfile = async (req, res) => {
  const { fullName, bio, profilePic } = req.body;
  const userId = req.user._id;

  let update = { fullName, bio };

  if (profilePic) {
    const upload = await cloudinary.uploader.upload(profilePic);
    update.profilePic = upload.secure_url;
  }

  const user = await User.findByIdAndUpdate(userId, update, { new: true });
  res.json({ success: true, user });
};
