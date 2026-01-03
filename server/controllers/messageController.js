import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// sidebar users
export const getUserForSidebar = async (req, res) => {
  const myId = req.user._id;

  const users = await User.find({ _id: { $ne: myId } }).select("-password");
  const unseenMessages = {};

  for (let user of users) {
    const count = await Message.countDocuments({
      senderId: user._id,
      receiverId: myId,
      seen: false,
    });
    if (count > 0) unseenMessages[user._id] = count;
  }

  res.json({ success: true, users, unseenMessages });
};

// get messages
export const getMessages = async (req, res) => {
  const myId = req.user._id;
  const otherId = req.params.id;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: otherId },
      { senderId: otherId, receiverId: myId },
    ],
  });

  await Message.updateMany(
    { senderId: otherId, receiverId: myId },
    { seen: true }
  );

  res.json({ success: true, messages });
};

// send message
export const sendMessage = async (req, res) => {
  const { text, image } = req.body;
  const senderId = req.user._id;
  const receiverId = req.params.id;

  let imageUrl = "";
  if (image) {
    const upload = await cloudinary.uploader.upload(image);
    imageUrl = upload.secure_url;
  }

  const newMessage = await Message.create({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });

  const socketId = userSocketMap[receiverId];
  if (socketId) io.to(socketId).emit("newMessage", newMessage);

  res.json({ success: true, newMessage });
};

// mark seen
export const markMessagesAsSeen = async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, { seen: true });
  res.json({ success: true });
};
