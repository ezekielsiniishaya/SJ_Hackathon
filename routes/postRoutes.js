const express = require("express");
const Post = require("../models/postModel");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Use auth middleware

// Route for creating a new post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate the input
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required." });
    }

    // Check if the user exists in req.user (from authMiddleware)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    // Create a new post
    const newPost = new Post({
      title,
      content,
      author: req.user, // Use req.user._id from the decoded JWT token
    });

    await newPost.save();

    return res.status(201).json(newPost);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
