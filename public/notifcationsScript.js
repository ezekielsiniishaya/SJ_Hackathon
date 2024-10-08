document.addEventListener("DOMContentLoaded", async function () {
  const loadingIndicator = document.getElementById("loadingIndicator");
  const mainContent = document.getElementById("mainContent");

  // Show loading indicator while fetching notifications
  loadingIndicator.style.display = "flex";

  try {
    // Fetch notifications
    await fetchNotifications();

    // Hide loading indicator after fetching data
    loadingIndicator.style.display = "none";
    // Show the main content
    // mainContent.style.display = "block";
  } catch (error) {
    console.error("Error loading notifications:", error);
    loadingIndicator.innerHTML =
      "<p>Error loading notifications. Please try again.</p>";
    loadingIndicator.style.display = "none"; // Hide loading indicator on error
  }
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

    // Display the read status or "Mark as Read" button
    const readStatus = document.createElement("span");
    if (notification.read) {
      readStatus.classList.add("badge", "badge-success");
      readStatus.textContent = "Read";
    } else {
      const markAsReadBtn = document.createElement("button");
      markAsReadBtn.classList.add("btn", "btn-outline-secondary", "btn-sm");
      markAsReadBtn.textContent = "Not Read";
      markAsReadBtn.addEventListener("click", async () => {
        try {
          await markNotificationAsRead(notification._id);
          fetchNotifications(); // Refresh notifications
        } catch (err) {
          console.error("Error marking notification as read:", err);
        }
      });
      notificationElement.appendChild(markAsReadBtn);
    }

    notificationElement.appendChild(readStatus);
    notificationsContainer.appendChild(notificationElement);
  });
}

// Function to mark a specific notification as read
async function markNotificationAsRead(notificationId) {
  try {
    const token = localStorage.getItem("authToken");

    await fetch(`/api/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error("Error marking notification as read:", err);
  }
}
