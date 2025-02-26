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
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch JSON file: ${response.statusText}`);
        const data = await response.json();
        console.log('✅ Fetched JSON Data:', data); // Debugging
        return data;
    } catch (error) {
        console.error('❌ Error fetching JSON:', error);
        return [];  // Return empty array to prevent crashes
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
        resultDiv.innerHTML = `
            <h3>${result.Prof || result.Name || "Unknown"}</h3>
            <p><strong>Location:</strong> ${result.Location || "Unknown"}</p>
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

    if (!searchInput || !searchButton || !resultsContainer) {
        console.error(`❌ Missing search elements: ${searchInputId}, ${searchButtonId}, ${resultsContainerId}`);
        return;
    }

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim().toLowerCase();
        console.log(`🔍 Searching for: "${query}"`); // Debugging

        // Filter results safely
        const filteredResults = data.filter(item => 
            (item.Prof && item.Prof.toLowerCase().includes(query)) || 
            (item.Name && item.Name.toLowerCase().includes(query))
        );
        console.log(`📌 Found ${filteredResults.length} results`); // Debugging

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
    const professorsData = await fetchJSONData('./doctor_locations.json'); // Fetch professors data
    const labsData = await fetchJSONData('./labs.json'); // Fetch labs data

    // Ensure JSON data is not empty before setting up search
    if (!Array.isArray(professorsData) || professorsData.length === 0) {
        console.error("❌ No valid data found in professors JSON file.");
    } else {
        // Set up search for Professors (Main Campus)
        setupSearch('professors-search', 'professors-search-btn', 'professors-results', professorsData);
        // Set up search for Secondary Campus
        setupSearch('secondary-search', 'secondary-search-btn', 'secondary-results', professorsData);
    }

    if (!Array.isArray(labsData) || labsData.length === 0) {
        console.error("❌ No valid data found in labs JSON file.");
    } else {
        // Set up search for Labs (Main Campus)
        setupSearch('labs-search', 'labs-search-btn', 'labs-results', labsData);
    }
}

// Event listeners for new buttons
if (searchProfessorsBtn && searchLabsBtn) {
    searchProfessorsBtn.addEventListener('click', (event) => {
        professorsSearchContainer.classList.toggle('hidden');
        labsSearchContainer.classList.add('hidden');
        event.stopPropagation();
    });

    searchLabsBtn.addEventListener('click', (event) => {
        labsSearchContainer.classList.toggle('hidden');
        professorsSearchContainer.classList.add('hidden');
        event.stopPropagation();
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
