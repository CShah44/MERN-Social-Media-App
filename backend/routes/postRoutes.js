import express from "express";
import {
  createPost,
  deletePost,
  getFeed,
  getPost,
  likeUnlike,
  replyToPost,
} from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeed);
router.get("/:id", getPost);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlike);
router.post("/reply/:id", protectRoute, replyToPost);

export default router;
