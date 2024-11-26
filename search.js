function showSuggestions(value) {
  const suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = ""; // Clear previous suggestions

  if (!value) return; // Exit if no input

  // Make a GET request to your Flask backend
  fetch(`http://127.0.0.1:5000/search?query=${encodeURIComponent(value)}`)
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
  const inputField = document.querySelector(".search input");
  inputField.value = product; // Set the input value to the selected product

  // Optionally, you can call a function to show the route to the selected product
  // showRouteToProduct(product.location);

  const suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = ""; // Clear suggestions after selection
}
