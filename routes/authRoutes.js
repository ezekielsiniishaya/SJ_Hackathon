const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const router = express.Router();
// Register User
router.post("/register", (req, res) => {
  const { name, username, bio, email, password } = req.body;

  // Validate input
  if (!name || !username || !bio || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Log incoming data
  //console.log("Registration data received:", req.body);
  //console.log(name, email, username, bio, password);
  // Check if user already exists (case-insensitive)
  User.findOne({ email: { $regex: new RegExp("^" + email + "$", "i") } }) // Case-insensitive regex search
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password and store the user
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err.message);
          return res.status(500).json({ message: "Error registering user" });
        }

        // Create a new user
        const newUser = new User({
          name,
          username,
          bio,
          email: email.toLowerCase(),
          password: hashedPassword,
        });

        // Save the new user
        newUser
          .save()
          .then((savedUser) => {
            res.status(201).json({ message: "Registration successful." });
            //console.log("User registered successfully:", savedUser);
          })
          .catch((saveError) => {
            console.error("Error saving user:", saveError.message);
            res.status(500).json({ message: "Username already taken" });
          });
      });
    })
    .catch((err) => {
      console.error("Error checking existing user:", err.message);
      res.status(500).json({ message: "Error checking existing user" });
    });
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log(email, password);

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    // console.log("User found:", user); // Debug: Log the found user

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    //console.log("Password match:", isMatch); // Debug: Log comparison result

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with the token and user details including additional fields
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: user.posts,
        likesGiven: user.likesGiven,
        profilePicture: user.profilePicture,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
