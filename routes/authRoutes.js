const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const router = express.Router();

// Register User
router.post("/register", (req, res) => {
  const { name, username, bio, email, password } = req.body;

  // Check if user already exists
  User.findOne({ email: email.toLowerCase() })
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
            console.log("User registered successfully:", savedUser);
          })
          .catch((saveError) => {
            console.error("Error saving user:", saveError.message);
            res.status(500).json({ message: "Error saving user" });
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

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("User found:", user); // Debug: Log the found user

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // Debug: Log comparison result

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with the token
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
