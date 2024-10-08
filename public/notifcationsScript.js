document.addEventListener("DOMContentLoaded", async function () {
  const loadingIndicator = document.getElementById("loadingIndicator");

  // Show loading indicator while fetching notifications
  loadingIndicator.style.display = "flex";

  try {
    // Fetch notifications
    await fetchNotifications();

    // Hide loading indicator after fetching data
    loadingIndicator.style.display = "none";
  } catch (error) {
    console.error("Error loading notifications:", error);
    loadingIndicator.innerHTML =
      "<p>Error loading notifications. Please try again.</p>";
    loadingIndicator.style.display = "none"; // Hide loading indicator on error
  }
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
});

// Function to fetch notifications from the server
async function fetchNotifications() {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch("/api/notifications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const notifications = await response.json();
      if (response.ok) {
        renderNotifications(notifications);
      } else {
        alert("Error fetching notifications: " + notifications.error);
      }
    } else {
      const text = await response.text();
      console.error("Unexpected response format:", text);
    }
  } catch (err) {
    console.error("Error fetching notifications:", err);
  }
}

// Function to render notifications to the page
function renderNotifications(notifications) {
  const notificationsContainer = document.getElementById(
    "notificationsContainer"
  );
  notificationsContainer.innerHTML = ""; // Clear existing notifications

  notifications.forEach((notification) => {
    const notificationElement = document.createElement("div");
    notificationElement.classList.add(
      "notification",
      "mb-3",
      "p-3",
      "border",
      "rounded",
      "bg-light"
    );

    const notificationHeader = `
        <div class="d-flex justify-content-between">
            <h5 class="notification-title">${notification.message}</h5>
            <p class="notification-date text-muted">${new Date(
              notification.createdAt
            ).toLocaleDateString()}</p>
        </div>
        <p class="notification-message">${
          notification.relatedUser ? notification.relatedUser.username : ""
        } ${notification.post ? "on " + notification.post.title : ""}</p>
    `;

    notificationElement.innerHTML = notificationHeader;

    // Display the read status
    const readStatus = document.createElement("span");
    if (notification.read) {
      readStatus.classList.add("badge", "badge-success");
      readStatus.textContent = "Read";
    } else {
      readStatus.classList.add("badge", "badge-secondary");
      readStatus.textContent = "Not Read";
    }

    notificationElement.appendChild(readStatus);
    notificationsContainer.appendChild(notificationElement);
  });
}

// Function to mark all notifications as read
async function markAsRead() {
  try {
    const token = localStorage.getItem("authToken");

    const response = await fetch(`/api/notifications/read`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark notifications as read");
    }

    // Optionally handle the response data
    const data = await response.json();
    //console.log("All notifications marked as read:", data);

    // After marking as read, fetch notifications again to update the UI
    await fetchNotifications(); // Refresh notifications after marking as read
  } catch (err) {
    console.error("Error marking notifications as read:", err);
  }
}
