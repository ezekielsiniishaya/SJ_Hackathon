// Show alert function
function showAlert(message) {
  const alertBox = document.getElementById("alert");
  alertBox.textContent = message;
  alertBox.style.display = "block"; // Show alert
  alertBox.className = "alert"; // Reset alert class

  // Automatically hide the alert after 5 seconds
  setTimeout(() => {
    alertBox.style.display = "none"; // Hide alert
  }, 5000);
}

// Function to update profile elements
function updateProfile(userData) {
  const name = document.getElementById("name");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const profilePicture = document.getElementById("profilePicture");
  const bio = document.getElementById("bio");
  const posts = document.getElementById("posts");
  const followers = document.getElementById("followers");
  const following = document.getElementById("following");
  const likeGiven = document.getElementById("likeGiven");

  if (name) {
    name.textContent = userData.name || "No name"; // Set name
  }
  if (username) {
    username.textContent = userData.username || "No username"; // Set username
  }
  if (email) {
    email.textContent = userData.email || "No email"; // Set email
  }
  if (profilePicture) {
    profilePicture.src = userData.profilePicture || "defaultProfilePic.png"; // Set profile picture with default
  }
  if (bio) {
    bio.textContent = userData.bio || "No bio available"; // Set default if bio is empty
  }
  if (posts) {
    posts.textContent = userData.posts.length + " Posts" || 0; // Count posts
  }
  if (followers) {
    followers.textContent = userData.followers.length + " Followers" || 0; // Count followers
  }
  if (following) {
    following.textContent = userData.following.length + " Following" || 0; // Count following
  }
}

// Load the profile once DOM is ready
async function loadProfile() {
  // Check if userData is stored in local storage
  const userData = JSON.parse(localStorage.getItem("userData"));
  //const userId = localStorage.getItem("userId"); // Get user ID from local storage
  //console.log("User ID:", userId); // Log the user ID to check its value
  // loadUserPosts(userId); // Call loadUserPosts with the valid userId

  if (userData) {
    //console.log("User data loaded from local storage:", userData);
    updateProfile(userData); // Update the profile elements with the fetched data
    loadUserPosts(userData._id); // Load user posts with the dynamic user ID
  } else {
    showAlert("User data not found in local storage. Please log in again.");
  }
  //console.log(userData._id);
  //console.log(userId);
}
//const userId = userData._id;
// console.log(userId);
async function loadUserPosts(userId) {
  const token = localStorage.getItem("authToken"); // Retrieve the token from local storage

  try {
    // Fetch posts by the user with authorization header
    const userResponse = await fetch(`/api/posts/${userId}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request
      },
    });
    if (!userResponse.ok) {
      throw new Error(`HTTP error! status: ${userResponse.status}`);
    }
    const userPosts = await userResponse.json();
    //console.log(token);
    // Fetch posts from followed users
    /*  const followedResponse = await fetch(
        `/api/posts/followed/${userId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request
          },
        }
      );
      if (!followedResponse.ok) {
        throw new Error(`HTTP error! status: ${followedResponse.status}`);
      }
      const followedPosts = await followedResponse.json();
*/
    // Display posts
    displayUserPosts(userPosts);
    //displayFollowedPosts(followedPosts);
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

function displayUserPosts(posts) {
  const userPostsContainer = document.getElementById("userPostsContainer");
  userPostsContainer.innerHTML = ""; // Clear previous posts

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("card", "post-card", "mb-3");

    postElement.innerHTML = `
      <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.content}</p>
          <div class="d-flex justify-content-between">
              <span class="like-count" style="font-size: 0.8em; color: gray;" data-id="${post._id}">
                  <strong>${post.likes.length} Likes</strong>
              </span> 
              <span class="comment-count" style="font-size: 0.8em; color: gray;" data-id="${post._id}">
                  <strong>${post.comments.length} Comments</strong>
              </span>
              <button class="btn btn-outline-primary btn-sm mb-4 view-comments-btn" data-id="${post._id}">View Comments</button>
          </div>
          <div class="comments-container" id="comments-${post._id}" style="display:none;"></div>
          <textarea class="comment-input form-control" placeholder="Type your comment here..." style="display:none;" rows="2"></textarea>
          <button class="btn btn-outline-primary btn-sm mb-4 post-comment-btn" style="display:none;" data-id="${post._id}">Post Comment</button>
      </div>
    `;

    userPostsContainer.appendChild(postElement); // Append the post element to the container

    // Add view comments button functionality
    const viewCommentsButton = postElement.querySelector(".view-comments-btn");
    viewCommentsButton.addEventListener("click", async () => {
      const commentsContainer =
        postElement.querySelector(`.comments-container`);
      if (commentsContainer.style.display === "none") {
        await loadComments(post._id, commentsContainer); // Load comments if hidden
        commentsContainer.style.display = "block"; // Show comments
        viewCommentsButton.innerText = "Hide Comments"; // Toggle button text

        // Show comment input area
        const commentInput = postElement.querySelector(".comment-input");
        const postCommentBtn = postElement.querySelector(".post-comment-btn");
        commentInput.style.display = "block"; // Show input
        postCommentBtn.style.display = "block"; // Show button
      } else {
        commentsContainer.style.display = "none"; // Hide comments
        viewCommentsButton.innerText = "View Comments"; // Toggle button text

        // Hide comment input area
        const commentInput = postElement.querySelector(".comment-input");
        const postCommentBtn = postElement.querySelector(".post-comment-btn");
        commentInput.style.display = "none"; // Hide input
        postCommentBtn.style.display = "none"; // Hide button
      }
    });

    // Add functionality to post a comment
    const postCommentButton = postElement.querySelector(".post-comment-btn");
    postCommentButton.addEventListener("click", async () => {
      const commentInput = postElement.querySelector(".comment-input");
      const commentContent = commentInput.value.trim();
      const commentCountElement = postElement.querySelector(".comment-count");

      if (commentContent) {
        await postComment(post._id, commentContent, commentCountElement);
        commentInput.value = ""; // Clear input after posting
        // Optionally, refresh comments after posting
        const commentsContainer =
          postElement.querySelector(`.comments-container`);
        await loadComments(post._id, commentsContainer);
      } else {
        alert("Please enter a comment before posting.");
      }
    });
  });
}

async function loadComments(postId, commentsContainer) {
  const token = localStorage.getItem("authToken"); // Get the token

  try {
    const response = await fetch(`/api/comment/posts/${postId}/comments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request
      },
    });

    if (response.ok) {
      const comments = await response.json();
      commentsContainer.innerHTML = ""; // Clear previous comments
      comments.forEach((comment) => {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");
        commentElement.innerHTML = `<p><strong>${comment.author.username}:</strong> ${comment.content}</p>`; // Display comment content and author
        commentsContainer.appendChild(commentElement); // Append comment to the container
      });
    } else {
      const errorData = await response.json();
      showAlert(errorData.message); // Show error message
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    showAlert("Failed to load comments.");
  }
}
loadProfile();
document
  .getElementById("logout-btn")
  .addEventListener("click", async function () {
    const token = localStorage.getItem("authToken"); // Replace 'token' with how you're storing it

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Send token in the Authorization header
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Remove the token from local storage after successful logout
        localStorage.removeItem("token");
        alert(data.message);
        window.location.href = "login.html"; // Redirect to login page after logout
      } else {
        console.error("Logout error:", data.message);
        alert("Error during logout: " + data.message);
      }
    } catch (error) {
      console.error("Error during logout request:", error);
      alert("Failed to logout. Try again.");
    }
  });
async function postComment(postId, content, commentCountElement) {
  const token = localStorage.getItem("authToken"); // Retrieve the token from local storage

  const currentComments = parseInt(commentCountElement.textContent) || 0; // Get current comment count
  commentCountElement.innerHTML = `<strong>${
    currentComments + 1
  } Comments</strong>`;
  try {
    const response = await fetch(`/api/comment/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request
        "Content-Type": "application/json", // Specify content type as JSON
      },
      body: JSON.stringify({ postId, content }), // Send postId and content in the body
    });

    if (response.ok) {
      const result = await response.json();
      // Handle success (e.g., show success message or update the UI)
      console.log("Comment posted:", result);
    } else {
      const errorData = await response.json();
      console.error("Error posting comment:", errorData.message);
      // Handle error (e.g., show error message)
    }
  } catch (error) {
    console.error("Network error:", error);
    // Handle network error
  }
}
