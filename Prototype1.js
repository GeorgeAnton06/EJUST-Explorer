/* Copyright © 2025 George Anton. All Rights Reserved.
   Authorized use only for Egypt-Japan University of Science and Technology. */

// Get elements
const mainCampusBtn = document.getElementById("main-campus-btn");
const secondaryCampusBtn = document.getElementById("secondary-campus-btn");
const mainCampusContent = document.getElementById("main-campus-content");
const secondaryCampusContent = document.getElementById("secondary-campus-content");
const searchProfessorsBtn = document.getElementById('search-professors-btn');
const searchLabsBtn = document.getElementById('search-labs-btn');
const professorsSearchContainer = document.getElementById('professors-search-container');
const labsSearchContainer = document.getElementById('labs-search-container');

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

// Get search-related elements
// Hide search containers initially
function initializeSearchContainers() {
    professorsSearchContainer.classList.add('hidden');
    labsSearchContainer.classList.add('hidden');
}

// Toggle search container visibility
function toggleSearchContainer(containerToShow, containerToHide) {
    containerToHide.classList.add('hidden');
    
    if (containerToShow.classList.contains('hidden')) {
        containerToShow.classList.remove('hidden');
    } else {
        containerToShow.classList.add('hidden');
    }
}

// Event listeners for search buttons
searchProfessorsBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleSearchContainer(professorsSearchContainer, labsSearchContainer);
});

searchLabsBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleSearchContainer(labsSearchContainer, professorsSearchContainer);
});

// Hide search containers when clicking outside
document.addEventListener('click', (event) => {
    const isClickInsideProfessors = professorsSearchContainer.contains(event.target);
    const isClickInsideLabs = labsSearchContainer.contains(event.target);
    const isClickOnProfBtn = event.target === searchProfessorsBtn;
    const isClickOnLabBtn = event.target === searchLabsBtn;
    
    if (!isClickInsideProfessors && !isClickInsideLabs && 
        !isClickOnProfBtn && !isClickOnLabBtn) {
        professorsSearchContainer.classList.add('hidden');
        labsSearchContainer.classList.add('hidden');
    }
});

// The rest of your existing code remains the same...
// (Continuing with fetchJSONData, displayResults, setupSearch, etc.)

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

// Rest of your existing code (map initialization, marker functions, etc.)
// ... (keep the rest of the original code)

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

    // Initialize search containers
    initializeSearchContainers();
}

// Replace the old initialization
window.addEventListener('DOMContentLoaded', initializeApplication);
