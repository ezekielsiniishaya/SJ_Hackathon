const mongoose = require("mongoose");

const TokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: "1h" }, // Token expires after 1 hour
});

module.exports = mongoose.model("TokenBlacklist", TokenBlacklistSchema);
