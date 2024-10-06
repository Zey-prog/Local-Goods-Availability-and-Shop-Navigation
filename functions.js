// Initialize the map and set its view to a chosen geographical point and zoom level
const map = L.map('map').setView([11.454754686931716, 123.15208710612488], 19); // Initial view

// Add a tile layer to the map (this is from OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add markers to the map
var marker = L.marker([11.454754686931716, 123.15208710612488]).addTo(map);
var marker1 = L.marker([11.455805724706472, 123.1517110247931]).addTo(map);
var marker2 = L.marker([11.454395987807628, 123.1528445371425]).addTo(map);

// Add popups to the markers
marker.bindPopup("<b>Not Available!</b><br>GAISANO.").openPopup();
marker1.bindPopup("<b>Available!</b><br>Imperial Appliance Plaza.").openPopup();
marker2.bindPopup("<b>Available!</b><br>Public Market.").openPopup();

// Create a marker for the user's location (initially at [0, 0])
// Create a marker to show the user's location (initially at [0, 0])
let userMarker = L.marker([0, 0]).addTo(map).bindPopup("Locating...");

// Function to update the map with new GPS coordinates
function updateLocation(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy; // Get accuracy in meters

    // Log the latitude, longitude, and accuracy for debugging
    console.log(`Latitude: ${lat}, Longitude: ${lng}, Accuracy: ${accuracy} meters`);

    // Update the map view and user marker based on GPS position
    map.setView([lat, lng], 19); // Zoom level 19 for precise location view
    userMarker.setLatLng([lat, lng]);
    userMarker.bindPopup(`You are here!<br>Accuracy: ${accuracy} meters`).openPopup();
}

// Handle errors in geolocation
function handleLocationError(error) {
    console.error("Geolocation error: " + error.message);

    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Location access denied by the user.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("Location request timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Request geolocation access with continuous tracking (watchPosition)
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(updateLocation, handleLocationError, {
        enableHighAccuracy: true,  // Use GPS for high accuracy
        maximumAge: 0,             // Do not cache location data
        timeout: 10000             // Timeout after 10 seconds
    });
} else {
    console.error("Geolocation is not supported by this browser.");
}