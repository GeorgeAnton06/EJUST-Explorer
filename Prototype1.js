// Get elements
const mainCampusBtn = document.getElementById("main-campus-btn");
const secondaryCampusBtn = document.getElementById("secondary-campus-btn");
const mainCampusContent = document.getElementById("main-campus-content");
const secondaryCampusContent = document.getElementById("secondary-campus-content");
const searchProfessorsBtn = document.getElementById("search-professors-btn");
const searchLabsBtn = document.getElementById("search-labs-btn");
const professorsSearchContainer = document.getElementById("professors-search-container");
const labsSearchContainer = document.getElementById("labs-search-container");

// Function to toggle visibility
function toggleVisibility(showElement, hideElement) {
    hideElement.classList.remove("show");
    setTimeout(() => {
        hideElement.classList.add("hidden");
        showElement.classList.remove("hidden");
        setTimeout(() => {
            showElement.classList.add("show");
        }, 10);
    }, 500);
}

// Function to hide both elements
function hideBoth(element1, element2) {
    element1.classList.remove("show");
    element2.classList.remove("show");
    setTimeout(() => {
        element1.classList.add("hidden");
        element2.classList.add("hidden");
    }, 500);
}

// Event listeners for campus buttons
if (mainCampusBtn && secondaryCampusBtn) {
    mainCampusBtn.addEventListener("click", (event) => {
        toggleVisibility(mainCampusContent, secondaryCampusContent);
        event.stopPropagation();
    });

    secondaryCampusBtn.addEventListener("click", (event) => {
        toggleVisibility(secondaryCampusContent, mainCampusContent);
        event.stopPropagation();
    });
}

// Event listeners for search buttons
if (searchProfessorsBtn && searchLabsBtn) {
    searchProfessorsBtn.addEventListener("click", (event) => {
        toggleVisibility(professorsSearchContainer, labsSearchContainer);
        event.stopPropagation();
    });

    searchLabsBtn.addEventListener("click", (event) => {
        toggleVisibility(labsSearchContainer, professorsSearchContainer);
        event.stopPropagation();
    });
}

// Hide content when clicking outside
document.addEventListener("click", (event) => {
    // Hide campus content if clicking outside
    if (!mainCampusContent.contains(event.target) && !secondaryCampusContent.contains(event.target) &&
        event.target !== mainCampusBtn && event.target !== secondaryCampusBtn) {
        hideBoth(mainCampusContent, secondaryCampusContent);
    }

    // Hide search containers if clicking outside
    if (!professorsSearchContainer.contains(event.target) && !labsSearchContainer.contains(event.target) &&
        event.target !== searchProfessorsBtn && event.target !== searchLabsBtn) {
        hideBoth(professorsSearchContainer, labsSearchContainer);
    }
});

// Function to fetch JSON data
async function fetchJSONData(url) {
    try {
        const response = await fetch(url + '?v=' + new Date().getTime());
        if (!response.ok) throw new Error(`Failed to fetch JSON file: ${response.statusText}`);
        const data = await response.json();
        return data;
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

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
}

// Main function to initialize everything
async function initializeSearch() {
    const professorsData = await fetchJSONData('./doctor_locations.json');
    const labsData = await fetchJSONData('./labs.json');

    setupSearch('professors-search', 'professors-search-btn', 'professors-results', professorsData);
    setupSearch('secondary-search', 'secondary-search-btn', 'secondary-results', professorsData);
    setupSearch('labs-search', 'labs-search-btn', 'labs-results', labsData);
}

// Call the initialize function when the page loads
window.addEventListener('DOMContentLoaded', initializeSearch);
