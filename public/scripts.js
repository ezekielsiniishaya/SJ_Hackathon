document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

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

  // Register Form Submission
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent the default form submission

      const formData = new FormData(event.target);

      // Get user input values
      const nameInput = formData.get("name").trim();
      const bioInput = formData.get("bio").trim();
      const usernameInput = formData.get("username").trim();
      const passwordInput = formData.get("password").trim();
      const emailInput = formData.get("email").trim();

      // Frontend Validation
      let isValid = true;
      let errorMessage = "";

      // Validate Username Length
      if (usernameInput.length < 3 || usernameInput.length > 20) {
        errorMessage = "Username must be between 3 and 20 characters.";
        isValid = false;
      }

      // Validate Password Length
      if (passwordInput.length < 4) {
        errorMessage = "Password must be at least 4 characters.";
        isValid = false;
      }

      // Validate Email Format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput)) {
        errorMessage = "Please enter a valid email address.";
        isValid = false;
      }

      if (!isValid) {
        showAlert(errorMessage);
        return; // Stop form submission if validation fails
      }

      // Prepare data to send to the server
      const data = {
        name: nameInput,
        username: usernameInput,
        bio: bioInput,
        password: passwordInput,
        email: emailInput,
      };
      // console.log("Data to send:", JSON.stringify(data)); // Log the data before sending

      try {
        const response = await fetch("/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json(); // Parse the error response
          throw new Error(errorData.message); // Create an error with the message from the backend
        } else {
          const successData = await response.json();
          showAlert(successData.message); // Display success message

          // Redirect to the login page after successful registration
          setTimeout(() => {
            window.location.href = "/auth/login"; // Redirect to login
          }, 2000);
        }
      } catch (error) {
        showAlert(error.message); // Display the error message to the user
      }
    });
  }

  // Login Form Submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent the default form submission

      const formData = new FormData(event.target);
      const email = formData.get("email").trim();
      const password = formData.get("password").trim();

      // Basic validation
      if (!email || !password) {
        showAlert("Email and Password are required!");
        return; // Stop form submission if validation fails
      }

      try {
        const response = await fetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }), // Send email and password
        });

        if (response.ok) {
          const { token, user } = await response.json(); // Expect token and profile data in response
          if (token) {
            localStorage.setItem("authToken", token);
            localStorage.setItem("userData", JSON.stringify(user)); // Store user data in local storage

            // Redirect to the profile page
            window.location.href = "/profile";
          } else {
            showAlert("Login successful, but no profile data found.");
          }
        } else {
          const errorData = await response.json();
          showAlert(errorData.message || "Login failed.");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        showAlert("An unexpected error occurred.");
      }
    });
  }
});
