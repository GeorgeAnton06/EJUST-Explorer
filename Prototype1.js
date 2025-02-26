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
async function fetchJSONData(url) {
    try {
        const response = await fetch(url + '?v=' + new Date().getTime());
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

        //
