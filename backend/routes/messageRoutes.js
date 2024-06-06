import express from "express";
import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/send", protectRoute, sendMessage);
router.post("/conversation", protectRoute, createConversation);
router.get("/:conversationId", protectRoute, getMessages);
router.get("/", protectRoute, getConversations);

export default router;
