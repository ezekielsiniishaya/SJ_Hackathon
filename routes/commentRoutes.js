const express = require("express");
const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const authMiddleware = require("../middleware/authMiddleware"); // Import the middleware
const router = express.Router();

// Route for creating a new comment
router.post("/", authMiddleware, async (req, res) => {
  // Apply the auth middleware
  try {
    const { postId, content } = req.body;

    // Validate the input
    if (!postId || !content) {
      return res
        .status(400)
        .json({ message: "Post ID and content are required." });
    }

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Create a new comment
    const newComment = new Comment({
      postId,
      author: req.user._id, // req.user._id from JWT
      content,
    });

    await newComment.save();

    // Push the comment ID to the post's comments array
    post.comments.push(newComment._id);
    await post.save();

    return res.status(201).json(newComment);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
