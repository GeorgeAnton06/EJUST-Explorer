/* Copyright © 2025 George Anton. All Rights Reserved.
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

const professorsResults = document.getElementById("professors-results");
const labsResults = document.getElementById("labs-results");

// Function to toggle campus content
function toggleCampusContent(showContent, hideContent) {
    hideContent.classList.remove("show");
    setTimeout(() => {
        hideContent.classList.add("hidden");
    }, 500);

    showContent.classList.remove("hidden");
    setTimeout(() => {
        showContent.classList.add("show");
    }, 10);
}

// Event listeners for campus buttons
if (mainCampusBtn && secondaryCampusBtn) {
    mainCampusBtn.addEventListener("click", () => {
        toggleCampusContent(mainCampusContent, secondaryCampusContent);
    });

    secondaryCampusBtn.addEventListener("click", () => {
        toggleCampusContent(secondaryCampusContent, mainCampusContent);
    });
}

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
        resultsContainer.classList.add("hidden"); // Hide if no results
    } else {
        results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-item';

            const location = result.Location || result.location || "Unknown";
            const description = result.description || "No description available";

            resultDiv.innerHTML = `
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>Description:</strong> ${description}</p>
            `;
            resultsContainer.appendChild(resultDiv);
        });
        resultsContainer.classList.remove("hidden"); // Show if results exist
    }
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
            resultsContainer.innerHTML = '';
            resultsContainer.classList.add("hidden"); // Hide if no input
        }
    });

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });
}

// Function to toggle search bars
function toggleSearchBar(showBar, hideBar) {
    hideBar.classList.add("hidden");
    hideBar.classList.remove("show");

    showBar.classList.remove("hidden");
    setTimeout(() => {
        showBar.classList.add("show");
    }, 10);
}

// Event listeners for search buttons
if (searchProfessorsBtn && searchLabsBtn) {
    searchProfessorsBtn.addEventListener('click', () => {
        toggleSearchBar(professorsSearchContainer, labsSearchContainer);
        professorsResults.classList.add("hidden"); // Reset results
    });

    searchLabsBtn.addEventListener('click', () => {
        toggleSearchBar(labsSearchContainer, professorsSearchContainer);
        labsResults.classList.add("hidden"); // Reset results
    });
}

// Hide search containers when clicking outside
document.addEventListener('click', (event) => {
    if (!professorsSearchContainer.contains(event.target) && !labsSearchContainer.contains(event.target) &&
        event.target !== searchProfessorsBtn && event.target !== searchLabsBtn) {
        professorsSearchContainer.classList.add("hidden");
        labsSearchContainer.classList.add("hidden");
        professorsResults.classList.add("hidden");
        labsResults.classList.add("hidden");
    }
});

// Main function to initialize everything
async function initializeSearch() {
    const professorsData = await fetchJSONData('./doctor_locations.json');
    const labsData = await fetchJSONData('./labs.json');

    if (professorsData.length === 0 || labsData.length === 0) {
        alert("Failed to load data. Please try again later.");
    }

    setupSearch('professors-search', 'professors-search-btn', 'professors-results', professorsData);
    setupSearch('labs-search', 'labs-search-btn', 'labs-results', labsData);
}

// Call the initialize function when the page loads
window.addEventListener('DOMContentLoaded', initializeSearch);
