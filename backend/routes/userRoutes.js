import express from "express";
import {
  followUnfollowUser,
  getUser,
  loginUser,
  logout,
  signupUser,
  updateUser,
} from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/profile/:username", getUser);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update/:id", protectRoute, updateUser);

export default router;
