// Initialize the map
var map = L.map("map").setView([11.454754686931716, 123.15208710612488], 19);

// Add a tile layer from OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://project-osrm.org/">OSRM</a>',
}).addTo(map);

// Variables to hold the user's position
let userMarker;
let userLat, userLng;

// Routing control variable
let control;

// Set mode variable (default is 'walking')
let mode = "walking";

function togglePanel() {
  const sidePanel = document.getElementById("sidePanel");
  const map = document.getElementById("map");
  const currentRight = window
    .getComputedStyle(sidePanel)
    .getPropertyValue("right");

  // Slide panel in or out
  if (currentRight === "0px") {
    sidePanel.style.right = "-40vw";
    map.classList.remove("disabled"); // Enable map interactions
  } else {
    sidePanel.style.right = "0px";
    map.classList.add("disabled"); // Disable map interactions
  }
}

// Get user's location once
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(updateLocation, showError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function fetchProductDetails(productName) {
  // Send request to Flask backend
  fetch(`/product-details?product=${encodeURIComponent(productName)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }

      // Add marker to the map
      if (data.latitude && data.longitude) {
        const marker = L.marker([data.latitude, data.longitude]).addTo(map)
          .bindPopup(`
                        <b>Product:</b> ${data.product}<br>
                        <b>Price:</b> ${data.price}<br>
                        <b>Stocks:</b> ${data.stocks}<br>
                        <b>Category:</b> ${data.category}<br>
                        <b>Market:</b> ${data.market}
                    `);
        marker.openPopup();
      } else {
        alert("Market location could not be determined.");
      }
    })
    .catch((error) => {
      console.error("Error fetching product details:", error);
      alert("An error occurred while fetching product details.");
    });
}

// Handle search bar selection
document.getElementById("search-bar").addEventListener("change", function () {
  const selectedProduct = this.value; // Assuming the search bar value is the product name
  fetchProductDetails(selectedProduct);
});

// Update user's location (called when getCurrentPosition succeeds)
function updateLocation(position) {
  userLat = position.coords.latitude;
  userLng = position.coords.longitude;

  // Remove existing user marker if it exists
  if (userMarker) {
    map.removeLayer(userMarker);
  }

  // Add marker for the user's current location
  userMarker = L.marker([userLat, userLng])
    .addTo(map)
    .bindPopup("You are here!")
    .openPopup();

  // Center the map on user's location
  map.setView([userLat, userLng], 15);

  // Show route to the closest marker
  showRouteToClosestMarker();
}

// Function to set the mode ('walking' or 'vehicle')
function setMode(newMode) {
  mode = newMode;
  if (userLat && userLng) {
    showRouteToClosestMarker(); // Recalculate route when mode changes
  }
}

// Function to show the route to the closest marker based on the mode
function showRouteToClosestMarker() {
  const markerLocations = [
    [11.454754686931716, 123.15208710612488], // GAISANO
    [11.455805724706472, 123.1517110247931], // Imperial Appliance Plaza
    [11.454395987807628, 123.1528445371425], // Public Market
  ];

  // Find the closest marker
  let closestLocation = markerLocations[0];
  let closestDistance = Infinity;

  markerLocations.forEach((location) => {
    const distance = map.distance([userLat, userLng], location);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestLocation = location;
    }
  });

  // Remove existing routing control if it exists
  if (control) {
    map.removeControl(control);
  }

  // Create a single route to the closest marker
  control = L.Routing.control({
    waypoints: [
      L.latLng(userLat, userLng), // User's location
      L.latLng(closestLocation[0], closestLocation[1]), // Closest marker location
    ],
    routeWhileDragging: true,
    createMarker: function () {
      return null; // Disable marker creation for the route
    },
    router: L.Routing.osrmv1({
      profile: mode === "walking" ? "foot" : "car", // Change the profile based on the mode
      serviceUrl: "https://router.project-osrm.org", // Use OSRM service
    }),
  }).addTo(map);
}

// Function to handle geolocation errors
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}
