# SJ_Hackathon

Our project for Social Justice Hackthon

# - A Social Platform for Posting and Interactions

# Overview

This web application is a simple yet interactive social platform that allows users to register, log in, post content, comment on posts, and interact with other users. It's designed with features that encourage user engagement and provide a seamless experience for managing user-generated content.

# Current Features

User Authentication:

Secure user registration and login functionality.
Passwords are hashed with bcrypt for security, and JWT tokens are used for user authentication.
User Posts:

Authenticated users can create posts and share them on the platform.
Posts contain the author's details, content, and a timestamp.
Comments:

Users can comment on posts, with each comment linked to a specific post and the commenting user.
User Logout:

Users can securely log out, and their JWT tokens are invalidated to prevent unauthorized access after logout.

# Planned Features

Liking Posts: Users can like posts, and the platform will display posts based on popularity in user feeds.
User Feeds: Once users log in, they will see a personalized feed showing posts sorted by the number of likes or posts from people they follow.
User Profiles: Profile pages will show user details, their posts, and posts they’ve liked, with an option to update their profile.
Follow System: Users can follow others, with their feed showing posts from people they follow.
Threaded Comments: Comments will support replies to create discussions around posts.
Search Functionality: Users will be able to search for posts based on keywords, hashtags, or specific users.
Notifications: Real-time notifications will alert users when someone likes or comments on their posts.
Hashtags: Posts can include hashtags, and users can filter posts by these tags.
Direct Messaging: A simple chat feature to allow private messages between users.
Tech Stack

Backend: Node.js with Express.js, MongoDB for database storage, and JWT for user authentication.
Frontend: Can be integrated with HTML, CSS, and JavaScript or frameworks like React.
Security: Uses bcrypt for password hashing, JWT tokens for secure user sessions, and a blacklist system for token invalidation upon logout.
Future Improvements
We plan to add more features to enhance user engagement and interactivity, such as post liking, search functionality, profile updates, and more.

Installation and Setup
To run this project locally:

Clone the repository.
Run npm install to install all dependencies.
Set up environment variables in a .env file for MongoDB connection and JWT secret.
Run the app using npm start and access it at localhost:3000.

# Implemented Features:

User Registration:

New users can sign up with their name, username, email, and password.
Passwords are securely hashed using bcrypt.
User Login:

Users can log in with their registered email and password.
Upon successful login, a JWT token is generated and sent to the client.
User Logout:

Users can log out, and the JWT token is blacklisted to prevent further use.
Posting Content:

Logged-in users can create posts with content and submit them to the platform.
Each post stores information about the author and timestamp.
Commenting on Posts:

Users can comment on posts created by others.
Comments are linked to the post and the user who commented.

# Planned Features:

Liking Posts:

Users can like posts, with the like count displayed on each post.
Prevent multiple likes from the same user.
User Feeds:

Posts will be displayed in a user feed, sorted by the number of likes (most liked first).
Users can view posts from all users in their feeds.
User Profiles:

Profile page displaying user details, personal posts, and liked posts.
Allow users to update their profile information.
Followers/Following:

Users can follow or unfollow others.
The feed can be personalized to show posts from followed users.
Post Comments and Replies:

Comments will have replies, creating threaded discussions under posts.
Search Functionality:

Allow users to search for posts by keywords, hashtags, or usernames.
Notifications:

Users will receive notifications for likes and comments on their posts.
Hashtags and Post Tags:

Posts can include tags or hashtags, and users can filter posts based on tags.
Messaging/Chat Feature:

A simple messaging feature allowing users to communicate privately.

# HTML PAGES

1. Home Page (Landing Page)
   Purpose: A welcoming page that provides an overview of the web app and its key features.
   Elements:
   Brief introduction to the app.
   Links to sign-up and login.
   Navigation menu for visitors (login, register, about).
   Posts from users (if users are not logged in, display public posts).
   Suggestions: Add a featured section to highlight trending posts or popular profiles.
2. Sign Up Page
   Purpose: To allow new users to register.
   Elements:
   Form for creating an account (name, email, password, etc.).
   Link to the login page if the user already has an account.
   Gravatar preview (or avatar preview based on chosen avatar service).
   Suggestions: Validate user inputs before submission (e.g., strong passwords, unique usernames).
3. Login Page
   Purpose: To allow existing users to log in.
   Elements:
   Form with fields for email and password.
   Link to the sign-up page for new users.
   Link to reset password (optional, based on future implementation).
   Suggestions: Include a "Remember me" option and secure login via JWT.
4. User Dashboard/Profile Page
   Purpose: Display user-specific content after login.
   Elements:
   User information (name, bio, profile picture, etc.).
   Links to edit profile settings.
   Display of user posts, comments, and post likes.
   "Follow" and "Followers" sections.
   Suggestions: Add stats like "Number of posts", "Followers", etc.
5. Edit Profile Page
   Purpose: Allow users to update their account information and profile picture.
   Elements:
   Form to edit bio, password, username, profile picture, etc.
   Option to select/change profile picture.
   Save changes button.
   Suggestions: Add the ability to preview changes before saving.
6. User Feed Page
   Purpose: Display posts from users that the logged-in user follows, ordered by most liked.
   Elements:
   A list of posts from followed users.
   Sort options (e.g., by most recent, most liked).
   Like, comment, and share buttons for each post.
   Suggestions: Add an infinite scrolling feature for a better user experience.
7. Post Creation Page
   Purpose: Allow users to create new posts.
   Elements:
   Form for adding content (text, images, etc.).
   Preview of the post before submission.
   Option to add tags or categories.
   Suggestions: Allow users to edit or delete posts they created.
8. Post Detail Page
   Purpose: Show a single post with all its comments and interactions.
   Elements:
   The post content.
   Section for comments and likes.
   Option to leave a comment or like the post.
   Suggestions: Allow users to reply to comments for deeper engagement.
9. Explore Page
   Purpose: Let users discover trending or new posts.
   Elements:
   Display of posts ordered by most liked or recent.
   Search bar for finding users, posts, or tags.
   Suggestions of users to follow.
   Suggestions: Add a trending section for popular posts and user profiles.
10. Followers/Following Page
    Purpose: Show the list of followers and the people the user is following.
    Elements:
    Two tabs: one for followers and one for following.
    Profile pictures and brief info of the followers/following.
    Suggestions: Allow users to unfollow directly from this page.
11. Logout Page (or Modal)
    Purpose: Allow users to log out of their account.
    Elements:
    A confirmation modal to ensure the user wants to log out.
    Suggestions: Include a notification upon successful logout and redirection to the home page.
    Additional Suggestions for the Web App:
    Search Functionality: Allow users to search for posts, tags, or other users.
    Notifications Page: Notify users when they get new followers, likes, or comments.
    Admin Panel (Optional): If you want to manage users, posts, or content from the backend, an admin panel can be useful.
    Responsive Design: Ensure all pages are mobile-friendly for a good user experience.
    Dark Mode Option: Offer a toggle for users to switch between light and dark modes.



**Link to pitchdeck;**

https://gamma.app/docs/ConnectSphere-Empowering-Farmers-Connecting-Communities-wd532hnmtnqqfxk
