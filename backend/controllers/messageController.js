import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const createConversation = async (req, res) => {
  try {
    const { participants, name } = req.body; // participants is an array of _ids
    const userId = req.user._id;

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

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "No such conversation found." });
    }

    const newMessage = await Message({
      text,
      sender: req.user._id,
      conversationId: conversationId,
    });

    await newMessage.save();
    await conversation.updateOne({
      $set: { lastMessage: { text, sender: req.user._id } },
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

    // console.log(user.groups);

    const conversations = await Conversation.find({
      _id: { $in: user.groups },
    }).populate("lastMessage", "groupName");

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};