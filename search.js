function showSuggestions(value) {
  const suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = ""; // Clear previous suggestions

  if (!value) return; // Exit if no input

  // Make a GET request to your Flask backend
  fetch(
    `http://127.0.0.1:5000/search-container?query=${encodeURIComponent(value)}`
  )
    .then((response) => response.json())
    .then((suggestions) => {
      suggestions.forEach((product) => {
        const suggestionItem = document.createElement("li");
        suggestionItem.textContent = product;

        // Add a click event listener to the suggestion
        suggestionItem.onclick = () => {
          selectProduct(product);
        };

        suggestionsList.appendChild(suggestionItem);
      });
    })
    .catch((error) => console.error("Error fetching suggestions:", error));
}

// Function to handle product selection
function selectProduct(product) {
  const inputField = document.querySelector(".search-input");
  inputField.value = product; // Set the input value to the selected product

  const suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = ""; // Clear suggestions after selection

  // Fetch product details and display them on the map
  fetchProductDetails(product);
}

// Function to fetch product details and show them on the map
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
        const {
          product,
          price,
          stocks,
          category,
          market,
          latitude,
          longitude,
        } = data;

        // Add marker to the map
        const marker = L.marker([latitude, longitude]).addTo(map);

        // Bind popup with product details
        marker
          .bindPopup(
            `
          <strong>${product}</strong><br>
          Price: ${price}<br>
          Stocks: ${stocks}<br>
          Category: ${category}<br>
          Market: ${market}
        `
          )
          .openPopup();

        // Center map to the marker
        map.setView([latitude, longitude], 15);
      }
    })
    .catch((err) => console.error("Error fetching product details:", err));
}
