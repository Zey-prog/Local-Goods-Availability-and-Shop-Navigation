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

          // Add click event
          suggestionItem.onclick = () => selectProduct(product);

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

// Function to handle product selection
function selectProduct(product) {
  const inputField = document.querySelector(".search-input");
  inputField.value = product; // Set the input value to the selected product

  const suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = ""; // Clear suggestions after selection
  suggestionsList.style.display = "none"; // Hide the suggestions box

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
          market_details, // Add market details
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
        map.setView([latitude, longitude], 30);
      }
    })
    .catch((err) => console.error("Error fetching product details:", err));
}

function showMarketProducts(marketName) {
  // Filter products by market
  const filteredProducts = productsData.filter(
    (product) => product.MARKET === marketName
  );

  // Get the product details container
  const productDetailsContainer = document.getElementById(
    "productDetailsContainer"
  );

  // Clear previous content
  productDetailsContainer.innerHTML = "";

  // Check if any products match
  if (filteredProducts.length === 0) {
    productDetailsContainer.innerHTML = `<p>No products found for ${marketName}</p>`;
    return;
  }

  // Create a list of products
  const productList = document.createElement("ul");
  filteredProducts.forEach((product) => {
    const productItem = document.createElement("li");
    productItem.innerHTML = `
      <strong>${product.PRODUCTS}</strong><br>
      Price: ${product.PRICE}<br>
      Stock: ${product.STOCKS}
    `;
    productList.appendChild(productItem);
  });

  // Add the list to the container
  productDetailsContainer.appendChild(productList);

  // Show the container
  productDetailsContainer.style.display = "block";
}
