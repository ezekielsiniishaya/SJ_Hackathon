//Dependencies declarations
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");
const postRoutes = require("./routes/postRoutes");
const logoutRoute = require("./routes/logoutRoute");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Connect to the database
connectDB();

// Define your routes here
app.get("/", (req, res) => {
  res.send("Welcome to the web app! You can send in your requests.");
});
//authentication
app.use("/auth", authRoutes);
//user profile
app.use("/api/users", userRoutes);
//posts
app.use("/api/posts", postRoutes);
//notifications
app.use("/api/notifications", notificationRoutes);
//comments
app.use("/api/comment", commentRoutes);
//logout
app.use("/api/logout", logoutRoute);
// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
