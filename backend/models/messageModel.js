import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    sender: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
      profilePic: String,
      username: String,
    },
    text: String,
    img: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const message = mongoose.model("Message", messageSchema);

export default message;
