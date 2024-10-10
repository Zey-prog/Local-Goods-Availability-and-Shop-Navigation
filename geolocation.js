function getLocation() {
  const status = document.getElementById("status");
  //Create a marker for the user's location (initially set to [0, 0])
  let userMarker = L.marker([0, 0]).addTo(map).bindPopup("You are here!");

  // Function to update user's location
  function updateLocation(position) {
    let lat = position.coords.latitude;
    var lng = position.coords.longitude;

    // Update the map view and user marker position
    map.setView([lat, lng], 120);
    userMarker.setLatLng([lat, lng]);
  }

  // Function to handle geolocation with continuous tracking
  function handleGeolocation() {
    if (navigator.geolocation) {
      // Start continuous tracking using watchPosition
      navigator.geolocation.watchPosition(
        function (position) {
          updateLocation(position);
        },
        function (error) {
          console.error("Geolocation error: " + error.message);
        },
        {
          enableHighAccuracy: true, // Use GPS for higher accuracy
          maximumAge: 0, // Do not use cached position
          timeout: 5000, // Timeout after 5 seconds
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  // Start continuous geolocation tracking
  handleGeolocation();
}

function showRoute() {
  const destinationLat = 10.3167; // Replace with your selected destination latitude
  const destinationLon = 123.8907; // Replace with your selected destination longitude

  if (currentLat && currentLon) {
    L.Routing.control({
      waypoints: [
        L.latLng(currentLat, currentLon),
        L.latLng(destinationLat, destinationLon),
      ],
      routeWhileDragging: true,
    }).addTo(map);
  } else {
    alert("Please locate your position first.");
  }
}
