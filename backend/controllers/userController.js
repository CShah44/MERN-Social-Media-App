import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/genTokenSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const signupUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid User Data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("ERROR");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPwdCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPwdCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 1,
    });

    res.status(200).json({ message: "User logged out!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// todo check
export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id)
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself!" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found!" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "Unfollow complete" });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      res.status(200).json({ message: "Follow complete" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.user._id; // here user comes through middleware
  let { name, email, password, profilePic, bio, username } = req.body;
  const { id } = req.params;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    if (id != userId.toString())
      return res.status(400).json({ error: "You cannot update other users!" });

    if (password) {
      const salt = bcrypt.getSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }

      const result = await cloudinary.uploader.upload(profilePic);
      profilePic = result.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;

    user = await user.save();

    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    user.password = null;

    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getUser = async (req, res) => {
  const { query } = req.params; //query is either username or _id

  try {
    let user;

    // check through mongoose if query is valid id
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(404).json({ error: "User not found!" });

    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
