const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    // The user who will receive the notification
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    // Type of notification (e.g., 'like', 'comment')
    type: String,
    enum: ["like", "comment"],
    required: true,
  },
  message: {
    // Notification message
    type: String,
    required: true,
  },
  read: {
    // Notification read status
    type: Boolean,
    default: false,
  },
  createdAt: {
    // Timestamp
    type: Date,
    default: Date.now,
  },
  relatedUser: {
    // User who performed the action
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    // Related post (if applicable)
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
