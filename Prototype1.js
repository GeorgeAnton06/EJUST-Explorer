// Get elements
const mainCampusBtn = document.getElementById("main-campus-btn");
const secondaryCampusBtn = document.getElementById("secondary-campus-btn");
const mainCampusContent = document.getElementById("main-campus-content");
const secondaryCampusContent = document.getElementById("secondary-campus-content");

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

// Event listeners for buttons
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
async function fetchJSONData() {
    try {
        const response = await fetch('./doctor_locations.json?v=' + new Date().getTime());
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
            <h3>${result.Prof || "Unknown"}</h3>
            <p><strong>Location:</strong> ${result.Location || "Unknown"}</p>
            <p><strong>Description:</strong> ${result.discreption || "No description available"}</p>
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
            item.Prof && item.Prof.toLowerCase().includes(query)
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
    const jsonData = await fetchJSONData(); // Fetch JSON data

    // Ensure JSON data is not empty before setting up search
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.error("❌ No valid data found in JSON file.");
        return;
    }

    // Set up search for Main Campus
    setupSearch('main-search', 'main-search-btn', 'main-results', jsonData);

    // Set up search for Secondary Campus
    setupSearch('secondary-search', 'secondary-search-btn', 'secondary-results', jsonData);
}

// Call the initialize function when the page loads
window.addEventListener('DOMContentLoaded', initializeSearch);
