const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Import your User model
const TokenBlacklist = require("../models/tokenBlacklist"); // Blacklist model for tokens

const authMiddleware = async (req, res, next) => {
  // Extract token from Authorization header
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    console.log("No token provided.");
    return res.redirect("/auth/login"); // Redirect to login if no token
  }

  try {
    // Check if the token is blacklisted
    const isBlacklisted = await TokenBlacklist.findOne({ token });
    if (isBlacklisted) {
      console.log("Token is blacklisted:", token);
      return res.redirect("/auth/login"); // Redirect if token is blacklisted
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user's details from the database (only _id and username for now)
    const user = await User.findById(decoded.id).select("_id username");

    if (!user) {
      console.log(`User not found for token: ${token}`);
      return res.redirect("/auth/login"); // Redirect if user is not found
    }

    // Attach user data to request object for future access
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Log the error in case of JWT verification failure or other issues
    console.error("JWT verification failed:", err.message);

    // Handle specific JWT errors if needed (e.g., expired, malformed tokens)
    if (err.name === "TokenExpiredError") {
      return res.redirect("/auth/login"); // Redirect if token is expired
    }

    return res.redirect("/auth/login"); // Redirect for any other token issues
  }
};

module.exports = authMiddleware;
