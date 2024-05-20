import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post does not exist." });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User does not exist." });
    }

    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post does not exist." });
    }

    // check if the user who is deleting is the one who posted
    if (post.postedBy.toString() != req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You can only delete your own post." });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "DELETED" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    let { postedBy, text, img } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "PostedBy and text fields are required" });
    }

    const user = await User.findById(postedBy);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() != req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const maxLength = 500;

    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    if (img) {
      const result = await cloudinary.uploader.upload(img);
      img = result.secure_url;
    }

    const newPost = new Post({
      postedBy,
      text,
      img,
    });

    await newPost.save();

    res.status(201).json({ message: "Posted!", newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const likeUnlike = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //Unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked!" });
    } else {
      //Like
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      res.status(200).json({ message: "Post liked!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const replyToPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user._id;
    const username = req.user.username;
    const userProfilePic = req.user.profilePic;

    const post = await Post.findById(postId);

    if (!text) {
      return res.status(400).json({ error: "Please enter a reply" });
    }

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const reply = {
      userId,
      text,
      userProfilePic,
      username,
    };

    post.replies.push(reply);
    post.save();

    res.status(200).json({ message: "Reply added successfully", post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following;

    const posts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
