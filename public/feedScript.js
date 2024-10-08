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

document
  .getElementById("feeds-btn")
  .addEventListener("click", async function () {
    // Fetch user-specific posts and display them
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData._id;
    console.log("User ID:", userId);

    if (userId) {
      await fetchPosts(userId); // Pass userId to fetchPosts
      window.location.href = "feeds.html"; // Redirect to feed page after posts are fetched and displayed
    } else {
      showAlert("User ID not found. Please log in again.");
    }
  });
async function fetchPosts(userId) {
  const token = localStorage.getItem("authToken"); // Get auth token

  try {
    const response = await fetch(
      `/api/posts/feed/${userId}`, // Use userId in the URL
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include token
        },
      }
    );

    if (response.ok) {
      const posts = await response.json();
      displayUserPosts(posts); // Render posts
    } else {
      const errorData = await response.json();
      showAlert(errorData.message);
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    showAlert("Failed to load posts.");
  }
}
async function displayUserPosts(posts) {
  const userPostsContainer = document.getElementById("feedsContainer");
  userPostsContainer.innerHTML = ""; // Clear previous posts

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("card", "post-card", "mb-3");

    postElement.innerHTML = `
  <div class="card-body">
    <p class="text-muted small mb-1">${post.author.username}</p> <!-- Display the username -->
    <h5 class="card-title">${post.title}</h5>
    <p class="card-text">${post.content}</p>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <span class="like-count" id="like-count" data-id="${post._id}">
        <strong>${post.likes.length} Likes</strong>
      </span>
      <span class="comment-count" data-id="${post._id}">
        <strong>${post.comments.length} Comments</strong>
      </span>
      <button class="btn btn-outline-info btn-sm view-comments-btn" data-id="${post._id}">
        View Comments
      </button>
    </div>
    <button class="btn btn-outline-primary btn-sm like-btn mb-3" data-id="${post._id}">
      <i class="fas fa-thumbs-up"></i> Like
    </button>
    <div class="comments-container border rounded p-2 mb-3" id="comments-${post._id}" style="display:none;"></div> 
    <div class="d-flex mb-2">
      <textarea class="form-control form-control-sm" id="new-comment-${post._id}" placeholder="Add a comment" rows="1"></textarea>
      <button class="btn btn-secondary btn-sm comment-btn ms-2" data-id="${post._id}">
        Submit
      </button>
    </div>
  </div>
`;

    userPostsContainer.appendChild(postElement);

    // Like post functionality
    const likeButton = postElement.querySelector(".like-btn");
    likeButton.addEventListener("click", () => likePost(post._id));

    // View comments functionality
    const viewCommentsButton = postElement.querySelector(".view-comments-btn");
    viewCommentsButton.addEventListener("click", async () => {
      const commentsContainer =
        postElement.querySelector(`.comments-container`);
      if (commentsContainer.style.display === "none") {
        await loadComments(post._id, commentsContainer); // Load comments if hidden
        commentsContainer.style.display = "block";
        viewCommentsButton.innerText = "Hide Comments";
      } else {
        commentsContainer.style.display = "none";
        viewCommentsButton.innerText = "View Comments";
      }
    });

    // Submit comment functionality
    const commentsContainer = postElement.querySelector(".comments-container");
    const commentButton = postElement.querySelector(".comment-btn");
    const commentCountElement = postElement.querySelector(
      ".comment-count[data-id='" + post._id + "']"
    );

    commentButton.addEventListener("click", async () => {
      const commentText = document.getElementById(
        `new-comment-${post._id}`
      ).value;
      await submitComment(
        post._id,
        commentText,
        commentCountElement,
        commentsContainer
      );
    });
  });
}
//function to like post
async function likePost(postId) {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `/api/posts/${postId}/like`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const updatedPost = await response.json(); // Get the updated post data

      // Access the like count element using the data-id attribute
      const likeCountElement = document.querySelector(
        `.like-count[data-id='${postId}']`
      );

      if (likeCountElement) {
        // Update the like count displayed in the UI
        likeCountElement.innerHTML = `<strong>${updatedPost.likes.length} Likes</strong>`;
      } else {
        console.error(`Like count element not found for postId: ${postId}`);
      }
    } else {
      const errorData = await response.json();
      showAlert(errorData.message);
    }
  } catch (error) {
    console.error("Error liking post:", error);
    showAlert("Failed to like post.");
  }
}

// Function to submit a comment
async function submitComment(
  postId,
  content,
  commentCountElement,
  commentsContainer
) {
  const token = localStorage.getItem("authToken"); // Retrieve the token from local storage

  if (!commentCountElement) {
    console.error("Comment count element not found.");
    return; // Exit the function if the element is not found
  }

  const currentComments = parseInt(commentCountElement.textContent) || 0; // Get current comment count
  commentCountElement.innerHTML = `<strong>${
    currentComments + 1
  } Comments</strong>`; // Update comment count

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
      console.log("Comment posted:", result);

      // Optionally call loadComments to refresh the comments section
      loadComments(postId, commentsContainer); // Refresh comments after successful submission
    } else {
      const errorData = await response.json();
      console.error("Error posting comment:", errorData.message);
      commentCountElement.innerHTML = `<strong>${currentComments} Comments</strong>`; // Revert back
    }
  } catch (error) {
    console.error("Network error:", error);
    commentCountElement.innerHTML = `<strong>${currentComments} Comments</strong>`; // Revert back
  }
}

// Function to load comments
async function loadComments(postId, commentsContainer) {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `/api/comment/posts/${postId}/comments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const comments = await response.json();
      commentsContainer.innerHTML = ""; // Clear previous comments

      comments.forEach((comment) => {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");
        commentElement.innerHTML = `<p><strong>${comment.author.username}:</strong> ${comment.content}</p>`;
        commentsContainer.appendChild(commentElement); // Append comment
      });
    } else {
      const errorData = await response.json();
      showAlert(errorData.message);
    }
  } catch (error) {
    console.error("Error loading comments:", error);
    showAlert("Failed to load comments.");
  }
}
// On page load, fetch and display posts
window.onload = fetchPosts;
