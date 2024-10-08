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
app.use(
  cors({
    origin: "*", // Allows requests from any origin
    credentials: true, // Optional: Enable this if your frontend sends credentials like cookies or authorization headers
  })
);

// Connect to the database
connectDB();

// Define your routes here
app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "profile.html"));
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.get("/feeds", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "feeds.html"));
});

// Free access to login and registration pages
app.get("/auth/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/auth/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html")); // Serve about.html
});

// Protect these routes with the authMiddleware

app.get("/post", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "post.html")); // Serve post.html
});

app.get("/feeds", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "feeds.html")); // Serve feeds.html
});

app.get("/notifications", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "notifications.html")); // Serve notifications.html
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
app.use("/api/profile", userRoutes);

// Start the server
const PORT = process.env.PORT; // Provide a default port if not specified
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
