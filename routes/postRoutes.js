const express = require("express");
const Post = require("../models/postModel");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Use auth middleware
const Notification = require("../models/notificationModel");
const User = require("../models/userModel"); // Import the User model to update user's post array

// Route to like a post
router.put("/:postId/like", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId).populate("author", "likes");
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Check if user already liked the post
    if (post.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this post." });
    }

    // Add user's like to the post
    post.likes.push(userId);
    post.likeCount += 1;
    await post.save();

    // Create a notification for the post author
    if (!post.author._id.equals(userId)) {
      const notification = new Notification({
        user: post.author._id, // The post's author
        type: "like",
        message: `${req.user.username} liked your post.`,
        relatedUser: userId,
        post: post._id,
      });
      await notification.save();
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
      author: req.user._id, // Use req.user._id from the decoded JWT token
    });
    //log post to the console
    //console.log("Post: ", newPost);
    // Save the post in the database
    const savedPost = await newPost.save();

    // Update the user's posts array
    const user = await User.findById(req.user._id);
    user.posts.push(savedPost._id); // Add the post ID to the user's posts array
    await user.save(); // Save the updated user with the new post ID

    return res.status(201).json(savedPost);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
// Route to get user posts by their IDs
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    // Find the user by ID and populate their posts
    const user = await User.findById(req.params.userId).populate("posts");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Sort the user's posts in descending order based on createdAt field
    const posts = user.posts.sort((a, b) => b.createdAt - a.createdAt);

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//route to send all posts made by all users to the feed
router.get("/feed/:userId", authMiddleware, async (req, res) => {
  try {
    // Find all posts, possibly sorted by creation date or likes
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username"); // Sorting by latest posts
    //console.log(posts);
    // Return all posts to the requesting user
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
