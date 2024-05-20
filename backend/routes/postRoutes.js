import express from "express";
import {
  createPost,
  deletePost,
  getFeed,
  getPost,
  getUserPosts,
  likeUnlike,
  replyToPost,
} from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeed);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlike);
router.put("/reply/:id", protectRoute, replyToPost);

export default router;
