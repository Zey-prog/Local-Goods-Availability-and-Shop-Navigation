let selectedProductDetails = null; // Variable to store selected product details

function showSuggestions(value) {
  const suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = "";

  if (value.trim() === "") {
    suggestionsList.style.display = "none"; // Hide when input is empty
    return;
  }

  // Make a GET request to your Flask backend
  fetch(
    `http://127.0.0.1:5000/search-container?query=${encodeURIComponent(value)}`
  )
    .then((response) => response.json())
    .then((suggestions) => {
      if (suggestions.length > 0) {
        // Populate suggestions
        suggestions.forEach((product) => {
          const suggestionItem = document.createElement("li");
          suggestionItem.textContent = product;

          // Add click event to store product details
          suggestionItem.onclick = () => {
            // Fetch product details to store them
            fetchProductDetails(product);
          };

          suggestionsList.appendChild(suggestionItem);
        });

        suggestionsList.style.display = "block"; // Show suggestions
      } else {
        suggestionsList.style.display = "none"; // Hide if no suggestions
      }
    })
    .catch((error) => {
      console.error("Error fetching suggestions:", error);
    });
}

// Function to fetch product details and store them
function fetchProductDetails(productName) {
  fetch(
    `http://127.0.0.1:5000/product_details?product=${encodeURIComponent(
      productName
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        // Store product details in the variable
        selectedProductDetails = {
          product: data.product,
          price: data.price,
          stocks: data.stocks,
          category: data.category,
          market: data.market,
          latitude: data.latitude,
          longitude: data.longitude,
        };

        // Set the input field value to the selected product name
        const searchInput = document.getElementById("search-bar");
        searchInput.value = data.product; // Update the search box with the selected product name

        // Clear suggestions after selection
        const suggestionsList = document.getElementById("suggestions");
        suggestionsList.innerHTML = "";
        suggestionsList.style.display = "none"; // Hide the suggestions box
      }
    })
    .catch((err) => console.error("Error fetching product details:", err));
}

// Function to handle search button click
function handleSearchButtonClick() {
  if (selectedProductDetails) {
    const { latitude, longitude, product, price, stocks, category, market } =
      selectedProductDetails;
    pinpointOnMap(
      latitude,
      longitude,
      product,
      price,
      stocks,
      category,
      market
    );
  } else {
    alert("Please select a product from the suggestions first.");
  }
}

// Update the search button in your HTML to call this function
document.querySelector(".search-button").onclick = handleSearchButtonClick;
