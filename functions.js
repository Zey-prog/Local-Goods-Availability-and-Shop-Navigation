// Hide Get Started screen and show main content
function hideGetStarted() {
  document.getElementById("getStartedContainer").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
  document.body.style.overflowY = "auto"; // Enable scrolling

  // Show the toggle button
  const toggleButton = document.querySelector(".toggle-button");
  toggleButton.style.display = "block";
}

function updateProfilePicture(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];
  const profilePicture = document.getElementById("profilePicture");

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      profilePicture.src = e.target.result; // Set the new image source
    };

    reader.readAsDataURL(file); // Read the uploaded file as a data URL
  }
}

function toggleRightPanel() {
  const rightPanel = document.getElementById("sidePanelRight");
  const rightButton = document.getElementById("toggleButtonRight");
  const currentRight = window
    .getComputedStyle(rightPanel)
    .getPropertyValue("right");

  if (currentRight === "0px") {
    rightPanel.style.right = "-40vw";
    rightButton.classList.remove("open");
  } else {
    rightPanel.style.right = "0px";
    rightButton.classList.add("open");
  }
}

function toggleLeftPanel() {
  const leftPanel = document.getElementById("sidePanelLeft");
  const leftButton = document.getElementById("toggleButtonLeft");
  const currentLeft = window
    .getComputedStyle(leftPanel)
    .getPropertyValue("left");

  if (currentLeft === "0px") {
    leftPanel.style.left = "-40vw";
    leftButton.classList.remove("open");
  } else {
    leftPanel.style.left = "0px";
    leftButton.classList.add("open");
  }
}

function toggleProfileDropdown() {
  const dropdownMenu = document.getElementById("profileDropdown");
  dropdownMenu.classList.toggle("show"); // Toggle visibility using the 'show' class
}

function toggleEmailDropdown() {
  const dropdownMenu = document.getElementById("emailDropdown");
  dropdownMenu.classList.toggle("show"); // Toggle visibility using the 'show' class
}

function toggleDropdown(dropdownId) {
  const dropdownMenu = document.getElementById(dropdownId);
  dropdownMenu.classList.toggle("show"); // Toggle visibility using the 'show' class
}

document
  .getElementById("profileForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent actual form submission

    // Collect form data
    const firstName = document.getElementById("firstName").value;
    const middleName = document.getElementById("middleName").value;
    const lastName = document.getElementById("lastName").value;
    const gender = document.getElementById("gender").value;
    const address = document.getElementById("address").value;

    // Display the collected data (you can replace this with an API call)
    alert(`
            First Name: ${firstName}
            Middle Name: ${middleName}
            Last Name: ${lastName}
            Gender: ${gender}
            Address: ${address}
        `);

    // Optionally reset the form
    event.target.reset();
  });

// Toggle Email Dropdown
function toggleEmailDropdown() {
  const emailDropdown = document.getElementById("emailDropdown");
  emailDropdown.classList.toggle("show");
}

// Handle Email Form Submission
document
  .getElementById("emailForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page refresh on form submission

    const emailInput = document.getElementById("email").value;
    const emailStatus = document.getElementById("emailStatus");

    if (emailInput) {
      // Simulate sending email to a server (replace with actual server API endpoint)
      fetch("https://your-backend-server.com/submit-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      })
        .then((response) => {
          if (response.ok) {
            emailStatus.textContent = "Email saved successfully!";
            emailStatus.style.color = "lime";
          } else {
            emailStatus.textContent = "Failed to save email. Try again.";
            emailStatus.style.color = "red";
          }
        })
        .catch((error) => {
          emailStatus.textContent = "Error: Unable to connect to the server.";
          emailStatus.style.color = "red";
        });
    } else {
      emailStatus.textContent = "Please enter a valid email address.";
      emailStatus.style.color = "red";
    }
  });

function logout() {
  // Attempt to close the tab or window
  if (
    window.confirm("Are you sure you want to logout and close the website?")
  ) {
    window.open("", "_self"); // Set the window to the current tab
    window.close(); // Try to close the window
  }
  // Note: If `window.close()` fails, it will do nothing in most modern browsers unless the tab was opened by `window.open()`.
}

function logout() {
  if (confirm("Are you sure you want to log out?")) {
    window.location.href = "https://example.com/logout-success"; // Replace with your desired URL
  }
}
