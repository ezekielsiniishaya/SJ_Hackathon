document.addEventListener("DOMContentLoaded", function () {
  // Fetch notifications on page load
  fetchNotifications();

  // Handle Mark All as Read button click
  const markAllReadBtn = document.getElementById("markAllRead");

  markAllReadBtn.addEventListener("click", async () => {
    try {
      // Get the token from localStorage (or wherever you store it)
      const token = localStorage.getItem("authToken");

      const response = await fetch("/api/notifications/read", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          // Refresh notifications after marking all as read
          fetchNotifications();
        } else {
          alert("Error: " + result.error);
        }
      } else {
        const text = await response.text();
        console.error("Unexpected response format:", text);
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
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
});
