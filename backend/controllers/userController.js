import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/genTokenSetCookie.js";

export const signupUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
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
      });
    } else {
      res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("ERROR");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPwdCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPwdCorrect) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 1,
    });

    res.status(200).json({ message: "User logged out!" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// todo check
export const followUnfollowUser = async (req, res) => {
  try {
    const userToModify = User.findById(id);
    const currentUser = User.findById(req.user._id);

    if (req.params.id === req.user._id)
      return res
        .status(400)
        .json({ message: "You cannot follow/unfollow yourself!" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ message: "User not found!" });

    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      req.status(200).json({ message: "Unfollow complete" });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      req.status(200).json({ message: "Follow complete" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.user._id; // here user comes through middleware
  const { name, email, password, profilePic, bio, username } = req.body;
  const { id } = req.params;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    if (id != userId.toString())
      return res
        .status(400)
        .json({ message: "You cannot update other users!" });

    if (password) {
      const salt = bcrypt.getSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getUser = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username })
      .select("-password")
      .select("-updatedAt");

    if (!user) return res.status(404).json({ message: "User not found!" });

    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
