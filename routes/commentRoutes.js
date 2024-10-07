const express = require("express");
const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const Notification = require("../models/notificationModel");

// Like a comment
router.put("/:commentId/like", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    // Find the comment by its ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Check if the user has already liked the comment
    if (comment.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You already liked this comment." });
    }

    // Add the user's ID to the likes array
    comment.likes.push(userId);
    await comment.save();

    // Optional: Create a notification for the comment author (if not the same as the liker)
    if (!comment.author.equals(userId)) {
      const notification = new Notification({
        user: comment.author, // The comment's author
        type: "like",
        message: `${req.user.username} liked your comment.`,
        relatedUser: userId, // The user liking the comment
        post: comment.postId, // Link to the related post
      });
      await notification.save();
    }

    res.status(200).json({ message: "Comment liked successfully.", comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for creating a new comment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.body;
    const { content } = req.body;
    const userId = req.user._id;

    // Validate comment content
    if (!content) {
      return res.status(400).json({ message: "Comment content is required." });
    }

    // Find the post being commented on
    const post = await Post.findById(postId).populate("author");
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Create a new comment in the Comment model
    const newComment = new Comment({
      content,
      author: userId, // User making the comment
      postId: postId, // Associate the comment with the post
    });
    //send the comment to console
    console.log("comment: ", newComment);
    // Save the new comment
    await newComment.save();

    // Push the new comment's ObjectId into the post's comments array
    post.comments.push(newComment._id);
    await post.save();

    // Create a notification for the post author (if not the same as the commenter)
    if (!post.author._id.equals(userId)) {
      const notification = new Notification({
        user: post.author._id, // The post's author
        type: "comment",
        message: `${req.user.username} commented on your post.`,
        relatedUser: userId, // The user making the comment
        post: post._id,
      });
      await notification.save();

      // Log notification to console to verify
      console.log("Notification created: ", notification);
    }

    res.status(201).json({ message: "Comment added successfully.", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//route for fetching comments

router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;

    // Find all comments related to the postId
    const comments = await Comment.find({ postId }).populate(
      "author",
      "username"
    );

    if (!comments) {
      return res.status(404).json({ message: "No comments found." });
    }

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
