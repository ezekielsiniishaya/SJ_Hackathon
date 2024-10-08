// Dependencies declarations
const express = require("express");
const dotenv = require("dotenv");
const path = require("path"); // Import path module
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");
const postRoutes = require("./routes/postRoutes");
const logoutRoute = require("./routes/logoutRoute");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware"); // Import the authMiddleware

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware for parsing JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files only to authenticated users
app.use("/public", express.static(path.join(__dirname, "public"))); // Protect static files
app.use(express.static("views"));
// Use CORS if necessary
app.use(cors());

// Connect to the database
connectDB();

// Define your routes here
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html")); // Serve index.html
});

app.get("/auth/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html")); // Serve register.html
});

app.get("/auth/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html")); // Serve login.html
});
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html")); // Serve about.html
});
// Protect these routes with the authMiddleware
app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "profile.html")); // Serve profile.html
});

app.get("/post", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "post.html")); // Serve post.html
});
app.get("/feeds", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "feeds.html")); // Serve post.html
});
app.get("/notifications", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "notifications.html")); // Serve post.html
});
// Authentication
app.use("/auth", authRoutes);
// User profile
app.use("/api/users", userRoutes);
// Posts
app.use("/api/posts", postRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);
// Comments
app.use("/api/comment", commentRoutes);
// Logout
app.use("/api/logout", logoutRoute);

// Start the server
const PORT = process.env.PORT || 5000; // Provide a default port if not specified
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
