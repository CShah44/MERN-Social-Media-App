import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import { getRecipientSocketId, io } from "../socket/socket.js";

export const createConversation = async (req, res) => {
  try {
    const { participants, name } = req.body; // participants is an array of _ids
    const userId = req.user._id;

    if (!participants.length || !name.length) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    participants.push(userId);

    const conversation = new Conversation({
      participants,
      groupName: name,
      createdBy: userId,
    });

    await conversation.save();

    participants.forEach(async (participantId) => {
      await User.findByIdAndUpdate(participantId, {
        $push: { groups: conversation._id },
      });
    });

    res.status(200).json(conversation);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    let { img } = req.body;

    const conversation = await Conversation.findById(conversationId);
    const user = await User.findById(req.user._id);

    if (!conversation) {
      return res.status(404).json({ error: "No such conversation found." });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newMessage = new Message({
      text,
      sender: {
        _id: req.user._id,
        name: user.name,
        username: user.username,
        profilePic: user.profilePic,
      },
      conversationId: conversationId,
      img: img || "",
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        $set: { lastMessage: { text, sender: req.user._id, name: user.name } },
      }),
    ]);

    const participants = conversation.participants.filter((p) => p != user._id);

    participants.forEach((participant) => {
      const socketId = getRecipientSocketId(participant);
      if (socketId) {
        io.to(socketId).emit("newMessage", newMessage);
      }
    });

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const con = await Conversation.findById(conversationId);

    if (!con) {
      return res.status(404).json({ error: "No group found." });
    }

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getConversations = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    const conversations = await Conversation.find({
      _id: { $in: user.groups },
    })
      .populate("lastMessage.sender", "name username")
      .populate("participants", "name profilePic username");

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
