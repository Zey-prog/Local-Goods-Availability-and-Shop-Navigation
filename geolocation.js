// Initialize the map and set its view to a chosen geographical point and zoom level
var map = L.map("map").setView([11.454754686931716, 123.15208710612488], 19); // Initial view

// Add a tile layer to the map (this is from OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Add markers to the map
var marker = L.marker([11.454754686931716, 123.15208710612488]).addTo(map);
var marker1 = L.marker([11.455805724706472, 123.1517110247931]).addTo(map);
var marker2 = L.marker([11.454395987807628, 123.1528445371425]).addTo(map);

// Add popups to the markers
marker.bindPopup("<b>Not Available!</b><br>GAISANO.").openPopup();
marker1.bindPopup("<b>Available!</b><br>Imperial Appliance Plaza.").openPopup();
marker2.bindPopup("<b>Available!</b><br>Public Market.").openPopup();

// Geolocation functionality
let userMarker;
let userLat, userLng;

function getLocation() {
  if (navigator.geolocation) {
    // Use watchPosition to track user's location in real-time
    navigator.geolocation.watchPosition(updateLocation, showError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function updateLocation(position) {
  userLat = position.coords.latitude;
  userLng = position.coords.longitude;

  // Remove existing user marker if it exists
  if (userMarker) {
    map.removeLayer(userMarker);
  }

  // Add a marker for the user's current location
  userMarker = L.marker([userLat, userLng])
    .addTo(map)
    .bindPopup("You are here!")
    .openPopup();

  // Center the map on the user's location
  map.setView([userLat, userLng], 15);

  // Call function to show routes to markers
  showRoutesToMarkers();
}

function showRoutesToMarkers() {
  const markerLocations = [
    [11.454754686931716, 123.15208710612488], // GAISANO
    [11.455805724706472, 123.1517110247931], // Imperial Appliance Plaza
    [11.454395987807628, 123.1528445371425], // Public Market
  ];

  markerLocations.forEach((location) => {
    L.Routing.control({
      waypoints: [
        L.latLng(userLat, userLng), // User's location
        L.latLng(location[0], location[1]), // Marker location
      ],
      routeWhileDragging: true,
      createMarker: function () {
        return null;
      }, // Disable marker creation for the route
    }).addTo(map);
  });
}

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
