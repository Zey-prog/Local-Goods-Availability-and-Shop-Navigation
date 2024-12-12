// Initialize the map
var map = L.map("map").setView([11.454754686931716, 123.15208710612488], 29);

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

// Fetch product details based on product name
function fetchProductDetails(productName) {
  fetch(`/product-details?product=${encodeURIComponent(productName)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }

      if (data.latitude && data.longitude) {
        const marker = L.marker([data.latitude, data.longitude])
          .addTo(map)
          .bindPopup(
            `Product: ${data.product}<br>Price: ${data.price}<br>Stocks: ${data.stocks}<br>Category: ${data.category}<br>Market: ${data.market}`
          )
          .openPopup();
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
  const selectedProduct = this.value;
  fetchProductDetails(selectedProduct);
});

// Update user's location
function updateLocation(position) {
  userLat = position.coords.latitude;
  userLng = position.coords.longitude;

  if (userMarker) {
    map.removeLayer(userMarker);
  }

  userMarker = L.marker([userLat, userLng])
    .addTo(map)
    .bindPopup("You are here!")
    .openPopup();

  map.setView([userLat, userLng], 30);

  // Show route to the closest marker
  showRouteToClosestMarker();
}

// Function to set mode (walking or vehicle)
function setMode(newMode) {
  mode = newMode;
  if (userLat && userLng) {
    showRouteToClosestMarker(); // Recalculate route when mode changes
  }
}

// Function to show route to the closest marker based on the mode
function showRouteToClosestMarker() {
  const markerLocations = [
    [11.454754686931716, 123.15208710612488], // GAISANO
    [11.455805724706472, 123.1517110247931], // Imperial Appliance Plaza
    [11.454395987807628, 123.1528445371425], // Public Market
  ];

  let closestLocation = markerLocations[0];
  let closestDistance = Infinity;

  markerLocations.forEach((location) => {
    const distance = map.distance([userLat, userLng], location);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestLocation = location;
    }
  });

  if (control) {
    map.removeControl(control);
  }

  control = L.Routing.control({
    waypoints: [
      L.latLng(userLat, userLng),
      L.latLng(closestLocation[0], closestLocation[1]),
    ],
    routeWhileDragging: true,
    createMarker: function () {
      return null; // Disable marker creation for the route
    },
    router: L.Routing.osrmv1({
      profile: mode === "walking" ? "foot" : "car",
      serviceUrl: "https://routing.openstreetmap.de/routed-foot/", // Use a different service
    }),
  }).addTo(map);
  z;
}

// Handle geolocation errors
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
