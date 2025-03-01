//* Copyright © 2025 George Anton. All Rights Reserved.
   Authorized use only for Egypt-Japan University of Science and Technology. */

// Get elements
const mainCampusBtn = document.getElementById("main-campus-btn");
const secondaryCampusBtn = document.getElementById("secondary-campus-btn");
const mainCampusContent = document.getElementById("main-campus-content");
const secondaryCampusContent = document.getElementById("secondary-campus-content");
const searchProfessorsBtn = document.getElementById("search-professors-btn");
const searchLabsBtn = document.getElementById("search-labs-btn");
const professorsSearchContainer = document.getElementById("professors-search-container");
const labsSearchContainer = document.getElementById("labs-search-container");

// Function to show campus content
function showCampusContent(showContent, hideContent) {
    hideContent.classList.remove("show");
    setTimeout(() => {
        hideContent.classList.add("hidden");
        showContent.classList.remove("hidden");
        setTimeout(() => {
            showContent.classList.add("show");
        }, 10);
    }, 500);
}

// Function to hide both contents
function hideCampusContent() {
    mainCampusContent.classList.remove("show");
    secondaryCampusContent.classList.remove("show");
    setTimeout(() => {
        mainCampusContent.classList.add("hidden");
        secondaryCampusContent.classList.add("hidden");
    }, 500);
}

// Event listeners for campus buttons
if (mainCampusBtn && secondaryCampusBtn) {
    mainCampusBtn.addEventListener("click", (event) => {
        showCampusContent(mainCampusContent, secondaryCampusContent);
        event.stopPropagation();
    });

    secondaryCampusBtn.addEventListener("click", (event) => {
        showCampusContent(secondaryCampusContent, mainCampusContent);
        event.stopPropagation();
    });
}

// Hide content when clicking outside
document.addEventListener("click", (event) => {
    if (!mainCampusContent.contains(event.target) && !secondaryCampusContent.contains(event.target) &&
        event.target !== mainCampusBtn && event.target !== secondaryCampusBtn) {
        hideCampusContent();
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
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-item'; // Add a class for styling

        // Normalize keys to handle case sensitivity
        const location = result.Location || result.location || "Unknown";
        const description = result.description || "No description available";

        resultDiv.innerHTML = `
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Description:</strong> ${description}</p>
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
        if (query.length > 0) {
            const filteredResults = data.filter(item =>
                (item.Prof && item.Prof.toLowerCase().includes(query)) ||
                (item.Name && item.Name.toLowerCase().includes(query)) ||
                (item.Location && item.Location.toLowerCase().includes(query))
            );
            displayResults(filteredResults, resultsContainer);
        } else {
            resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
        }
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
}

// Toggle visibility for search bars
if (searchProfessorsBtn && searchLabsBtn) {
    searchProfessorsBtn.addEventListener('click', () => {
        // Show professor search bar and hide lab search bar
        professorsSearchContainer.classList.remove('hidden');
        labsSearchContainer.classList.add('hidden');

        // Update button states
        searchProfessorsBtn.classList.add('active');
        searchLabsBtn.classList.remove('active');
    });

    searchLabsBtn.addEventListener('click', () => {
        // Show lab search bar and hide professor search bar
        labsSearchContainer.classList.remove('hidden');
        professorsSearchContainer.classList.add('hidden');

        // Update button states
        searchLabsBtn.classList.add('active');
        searchProfessorsBtn.classList.remove('active');
    });
}

// Hide search containers when clicking outside
document.addEventListener('click', (event) => {
    if (!professorsSearchContainer.contains(event.target) && !labsSearchContainer.contains(event.target) &&
        event.target !== searchProfessorsBtn && event.target !== searchLabsBtn) {
        // Hide both search bars and reset button states
        professorsSearchContainer.classList.add('hidden');
        labsSearchContainer.classList.add('hidden');
        searchProfessorsBtn.classList.remove('active');
        searchLabsBtn.classList.remove('active');
    }
});

// Main function to initialize everything
async function initializeSearch() {
    const professorsData = await fetchJSONData('/NavEJUST/doctor_locations.json');
    const labsData = await fetchJSONData('/NavEJUST/labs.json');

    if (professorsData.length === 0 || labsData.length === 0) {
        alert("Failed to load data. Please try again later.");
    }

    setupSearch('professors-search', 'professors-search-btn', 'professors-results', professorsData);
    setupSearch('secondary-search', 'secondary-search-btn', 'secondary-results', professorsData);
    setupSearch('labs-search', 'labs-search-btn', 'labs-results', labsData);
}

// Call the initialize function when the page loads
window.addEventListener('DOMContentLoaded', initializeSearch);
