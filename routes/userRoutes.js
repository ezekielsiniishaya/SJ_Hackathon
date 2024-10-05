const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const authMiddleware = require("../middleware/authMiddleware");

// Route for fetching user profile data
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const gravatarUrl = user.getGravatarUrl(200); // Fetch Gravatar URL for this user
    return res.status(200).json({
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: gravatarUrl, // Use Gravatar URL as profile picture
      followers: user.followers.length,
      following: user.following.length,
      posts: user.posts.length,
      createdAt: user.createdAt,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
