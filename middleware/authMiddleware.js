const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Make sure to import your User model
const TokenBlacklist = require("../models/tokenBlacklist");

const authMiddleware = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    console.log("No token provided.");
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied." });
  }

  // Check if the token is blacklisted
  const isBlacklisted = await TokenBlacklist.findOne({ token });
  if (isBlacklisted) {
    console.log("Token is blacklisted:", token);
    return res
      .status(401)
      .json({ message: "Token is invalid, please log in again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user's full details from the database
    const user = await User.findById(decoded.id).select("_id username"); // Select only the fields you need (_id and username)

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Attach the user's _id and username to req.user
    req.user = user;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Token is not valid." });
  }
};

module.exports = authMiddleware;
