const express = require("express");
const TokenBlacklist = require("../models/tokenBlacklist"); // Model to store blacklisted tokens
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Logout User
router.post("/", authMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Get the token from the Authorization header

    // Add the token to the blacklist
    const blacklistedToken = new TokenBlacklist({ token });
    await blacklistedToken.save();

    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.error("Error during logout:", err.message);
    res.status(500).json({ message: "Error during logout" });
  }
});

module.exports = router;
