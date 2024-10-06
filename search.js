// Fetch suggestions from the Flask backend
async function fetchSuggestions(query) {
    const response = await fetch(`/search?query=${query}`);
    return await response.json();
}

// Display suggestions
const searchInput = document.getElementById('search');
const suggestionsList = document.getElementById('suggestions');

searchInput.addEventListener('input', async () => {
    const query = searchInput.value.toLowerCase();
    suggestionsList.innerHTML = '';  // Clear old suggestions

    if (query) {
        const suggestions = await fetchSuggestions(query);
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            li.addEventListener('click', () => {
                searchInput.value = suggestion;  // Set the search bar to the selected suggestion
                suggestionsList.innerHTML = '';  // Clear the suggestions after selection
            });
            suggestionsList.appendChild(li);
        });

        // Show or hide suggestions based on matches
        suggestionsList.style.display = suggestions.length ? 'block' : 'none';
    } else {
        suggestionsList.style.display = 'none';  // Hide if the query is empty
    }
});