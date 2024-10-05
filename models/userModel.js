//dependencies
const mongoose = require("mongoose");
const md5 = require("md5");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String, // URL to the image
    default: function () {
      // Use the Gravatar as the default profile picture
      const hash = md5(this.email.trim().toLowerCase());
      return `https://www.gravatar.com/avatar/${hash}?s=200&d=monsterid`;
    },
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  likesGiven: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to get Gravatar URL
userSchema.methods.getGravatarUrl = function (size = 200) {
  const hash = md5(this.email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=monsterid`;
};

module.exports = mongoose.model("User", userSchema);
