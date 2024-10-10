// Function to show suggestions
function showSuggestions(query) {
  if (query.length === 0) {
    document.getElementById("suggestions").innerHTML = "";
    return;
  }

  fetch(`http://127.0.0.1:5000/search?query=${query}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let suggestions = "";
      data.forEach((item) => {
        suggestions += `<li>${item}</li>`;
      });
      document.getElementById("suggestions").innerHTML = suggestions;
    })
    .catch((error) => console.error("Error:", error));
}
