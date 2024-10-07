document
  .getElementById("create-post-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const postTitle = document.getElementById("postTitle").value;
    const postContent = document.getElementById("postContent").value;

    // Create the post object to send to the server
    const postData = {
      title: postTitle,
      content: postContent,
    };

    try {
      // Send the post data to the server
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify that we're sending JSON
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include the auth token
        },
        body: JSON.stringify(postData), // Convert the postData object to a JSON string
      });

      if (response.ok) {
        const result = await response.json(); // Parse the JSON response
        alert("Post created successfully!"); // Show success message

        // Redirect to the feeds page
        window.location.href = "feeds.html"; // Redirect to feeds page
      } else {
        const errorData = await response.json(); // Get error response
        alert("Error creating post: " + errorData.message); // Show error message
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again."); // Handle fetch error
    }
  });
