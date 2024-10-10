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
