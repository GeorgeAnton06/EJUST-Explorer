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
// Function to fetch JSON data with better error handling
async function fetchJSONData(url) {
    try {
        // Show loading indicator in results containers
        document.getElementById('professors-results').innerHTML = '<div class="loading"></div>';
        document.getElementById('labs-results').innerHTML = '<div class="loading"></div>';
        document.getElementById('secondary-results').innerHTML = '<div class="loading"></div>';
        
        const response = await fetch(url + '?v=' + new Date().getTime());
        
        if (!response.ok) {
            throw new Error(`Failed to fetch JSON file: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching JSON:', error);
        
        // Display a user-friendly error message
        const errorMessage = `
            <div class="error-message">
                <h3>Unable to load data</h3>
                <p>There was an error loading the data. Please try again later.</p>
                <p>Details: ${error.message}</p>
            </div>
        `;
        
        document.getElementById('professors-results').innerHTML = errorMessage;
        document.getElementById('labs-results').innerHTML = errorMessage;
        document.getElementById('secondary-results').innerHTML = errorMessage;
        
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

// Toggle visibility for search bars
if (searchProfessorsBtn && searchLabsBtn) {
    searchProfessorsBtn.addEventListener('click', () => {
        professorsSearchContainer.classList.toggle('hidden');
        labsSearchContainer.classList.add('hidden');
    });

    searchLabsBtn.addEventListener('click', () => {
        labsSearchContainer.classList.toggle('hidden');
        professorsSearchContainer.classList.add('hidden');
    });
}

// Hide search containers when clicking outside
document.addEventListener('click', (event) => {
    if (!professorsSearchContainer.contains(event.target) && !labsSearchContainer.contains(event.target) &&
        event.target !== searchProfessorsBtn && event.target !== searchLabsBtn) {
        professorsSearchContainer.classList.add('hidden');
        labsSearchContainer.classList.add('hidden');
    }
});

// Call the initialize function when the page loads
window.addEventListener('DOMContentLoaded', initializeSearch);

// Add this to your Prototype1.js file

// Map initialization functions
let mainCampusMap, secondaryCampusMap;

function initializeMaps() {
    // Initialize Main Campus Map
    mainCampusMap = L.map('main-campus-map').setView([31.2001, 29.9187], 16); // Coordinates for EJUST main campus
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mainCampusMap);

    // Initialize Secondary Campus Map
    secondaryCampusMap = L.map('secondary-campus-map').setView([31.2001, 29.9187], 16); // Update with correct secondary campus coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(secondaryCampusMap);

    // Adjust maps when content is shown
    mainCampusBtn.addEventListener("click", () => {
        setTimeout(() => {
            mainCampusMap.invalidateSize();
        }, 600);
    });

    secondaryCampusBtn.addEventListener("click", () => {
        setTimeout(() => {
            secondaryCampusMap.invalidateSize();
        }, 600);
    });
}

// Function to add markers for professors and labs
function addMarkersToMap(data, map, type) {
    data.forEach(item => {
        const name = item.Prof || item.Name || "Unknown";
        const location = item.Location || item.location || "Unknown";
        const description = item.description || "No description available";
        
        // Create a marker
        const marker = L.marker([0, 0]).addTo(map); // Placeholder coordinates
        
        // You'll need to convert building/room codes to actual coordinates
        // This is a simplified example - you would need actual coordinate mapping
        updateMarkerPosition(marker, location);
        
        // Add popup with information
        marker.bindPopup(`<b>${name}</b><br>${location}<br>${description}`);
    });
}

// This function would need actual mapping data for your campus
function updateMarkerPosition(marker, locationCode) {
    // This is where you would convert location codes like "B8 F1 06" to actual coordinates
    // For now, we'll use random offsets for demonstration
    const baseCoords = [31.2001, 29.9187]; // Base coordinates for EJUST
    
    // Extract building number if possible
    let buildingNum = 0;
    if (locationCode.startsWith('B')) {
        buildingNum = parseInt(locationCode.match(/B(\d+)/)?.[1] || 0);
    }
    
    // Create a deterministic but different position based on location code
    // This is just for demonstration - you would need actual mapping data
    const lat = baseCoords[0] + (buildingNum * 0.0002);
    const lng = baseCoords[1] + (locationCode.length * 0.0001);
    
    marker.setLatLng([lat, lng]);
}

// Modified initialize function
async function initializeApplication() {
    const professorsData = await fetchJSONData('./doctor_locations.json');
    const labsData = await fetchJSONData('./labs.json');

    setupSearch('professors-search', 'professors-search-btn', 'professors-results', professorsData);
    setupSearch('secondary-search', 'secondary-search-btn', 'secondary-results', professorsData);
    setupSearch('labs-search', 'labs-search-btn', 'labs-results', labsData);
    
    initializeMaps();
    
    // Add markers to maps
    if (professorsData.length > 0) {
        addMarkersToMap(professorsData, mainCampusMap, 'professor');
        addMarkersToMap(professorsData, secondaryCampusMap, 'professor');
    }
    
    if (labsData.length > 0) {
        addMarkersToMap(labsData, mainCampusMap, 'lab');
    }
}

// Replace the old initialization
window.addEventListener('DOMContentLoaded', initializeApplication);
