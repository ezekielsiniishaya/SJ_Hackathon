const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");

// Route for fetching user profile data
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const gravatarUrl = user.getGravatarUrl(200); // Fetch Gravatar URL for this user
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      likesGiven: user.likesGiven,
      profilePicture: user.profilePicture,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
