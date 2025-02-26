// Get elements
const mainCampusBtn = document.getElementById("main-campus-btn");
const secondaryCampusBtn = document.getElementById("secondary-campus-btn");
const mainCampusContent = document.getElementById("main-campus-content");
const secondaryCampusContent = document.getElementById("secondary-campus-content");
const searchProfessorsBtn = document.getElementById("search-professors-btn");
const searchLabsBtn = document.getElementById("search-labs-btn");
const professorsSearchContainer = document.getElementById("professors-search-container");
const labsSearchContainer = document.getElementById("labs-search-container");
const professorsResultsContainer = document.getElementById("professors-results");
const labsResultsContainer = document.getElementById("labs-results");
const secondaryResultsContainer = document.getElementById("secondary-results");

// Ensure both search bars are hidden on page load
document.addEventListener("DOMContentLoaded", () => {
    professorsSearchContainer.classList.add("hidden");
    labsSearchContainer.classList.add("hidden");
});

// Function to show one section and hide the other
function toggleSection(showSection, hideSection) {
    if (showSection.classList.contains("hidden")) {
        showSection.classList.remove("hidden");
        hideSection.classList.add("hidden");
    } else {
        showSection.classList.add("hidden");
    }
}

// Event listeners for search buttons
if (searchProfessorsBtn && searchLabsBtn) {
    searchProfessorsBtn.addEventListener("click", (event) => {
        toggleSection(professorsSearchContainer, labsSearchContainer);
        event.stopPropagation();
    });

    searchLabsBtn.addEventListener("click", (event) => {
        toggleSection(labsSearchContainer, professorsSearchContainer);
        event.stopPropagation();
    });
}

// Hide search containers when clicking outside
document.addEventListener("click", (event) => {
    if (!professorsSearchContainer.contains(event.target) && 
        !labsSearchContainer.contains(event.target) && 
        event.target !== searchProfessorsBtn && 
        event.target !== searchLabsBtn) {
        professorsSearchContainer.classList.add("hidden");
        labsSearchContainer.classList.add("hidden");
    }
});

// Function to fetch JSON data
async function fetchJSONData(url) {
    try {
        const response = await fetch(url + '?v=' + new Date().getTime());
        if (!response.ok) throw new Error(`Failed to fetch JSON file: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return [];
    }
}

// Function to display search results
function displayResults(results, resultsContainer) {
    resultsContainer.innerHTML = '';
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }
    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `
            <h3>${result.Prof || result.Name || "Unknown"}</h3>
            <p><strong>Location:</strong> ${result.Location || result.location || "Unknown"}</p>
            <p><strong>Description:</strong> ${result.description || "No description available"}</p>
        `;
        resultsContainer.appendChild(resultDiv);
    });
}

// Function to set up search functionality
function setupSearch(searchInputId, searchButtonId, resultsContainerId, data) {
    const searchInput = document.getElementById(searchInputId);
    const searchButton = document.getElementById(searchButtonId);
    const resultsContainer = document.getElementById(resultsContainerId);

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim().toLowerCase();
        const filteredResults = data.filter(item => 
            (item.Prof && item.Prof.toLowerCase().includes(query)) || 
            (item.Name && item.Name.toLowerCase().includes(query))
        );
        displayResults(filteredResults, resultsContainer);
    });
}

// Main function to initialize search
async function initializeSearch() {
    const professorsData = await fetchJSONData('./doctor_locations.json');
    const labsData = await fetchJSONData('./labs.json');

    setupSearch('professors-search', 'professors-search-btn', 'professors-results', professorsData);
    setupSearch('secondary-search', 'secondary-search-btn', 'secondary-results', professorsData);
    setupSearch('labs-search', 'labs-search-btn', 'labs-results', labsData);
}

// Call the initialize function when the page loads
window.addEventListener('DOMContentLoaded', initializeSearch);
