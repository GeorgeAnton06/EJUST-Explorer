// Get elements
const mainCampusBtn = document.getElementById("main-campus-btn");
const secondaryCampusBtn = document.getElementById("secondary-campus-btn");
const mainCampusContent = document.getElementById("main-campus-content");
const secondaryCampusContent = document.getElementById("secondary-campus-content");
const searchButtons = document.getElementById("search-buttons");
const professorBtn = document.getElementById("professor-btn");
const labsBtn = document.getElementById("labs-btn");
const professorSearchContainer = document.getElementById("professor-search-container");
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

// Function to toggle search bars
function toggleSearch(active, inactive) {
    active.classList.remove("hidden");
    inactive.classList.add("hidden");
}

// Event listeners for main and secondary campus buttons
if (mainCampusBtn && secondaryCampusBtn) {
    mainCampusBtn.addEventListener("click", (event) => {
        showCampusContent(mainCampusContent, secondaryCampusContent);
        searchButtons.classList.remove("hidden"); // Show search buttons
        event.stopPropagation();
    });

    secondaryCampusBtn.addEventListener("click", (event) => {
        showCampusContent(secondaryCampusContent, mainCampusContent);
        event.stopPropagation();
    });
}

// Event listeners for professor and labs search buttons
professorBtn.addEventListener("click", () => {
    toggleSearch(professorSearchContainer, labsSearchContainer);
});

labsBtn.addEventListener("click", () => {
    toggleSearch(labsSearchContainer, professorSearchContainer);
});

// Function to fetch JSON data
async function fetchJSONData(url) {
    try {
        const response = await fetch(url + "?v=" + new Date().getTime());
        if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("❌ Error fetching JSON:", error);
        return []; // Return empty array to prevent crashes
    }
}

// Function to display search results
function displayResults(results, resultsContainer, isLab) {
    resultsContainer.innerHTML = ""; // Clear previous results
    if (results.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }
    results.forEach(result => {
        const resultDiv = document.createElement("div");
        resultDiv.innerHTML = `
            <h3>${isLab ? result.Name : result.Prof}</h3>
            <p><strong>Location:</strong> ${result.Location || result.location || "Unknown"}</p>
            <p><strong>Description:</strong> ${result.description || "No description available"}</p>
        `;
        resultsContainer.appendChild(resultDiv);
    });
}

// Function to set up search functionality
function setupSearch(searchInputId, searchButtonId, resultsContainerId, data, key, isLab) {
    const searchInput = document.getElementById(searchInputId);
    const searchButton = document.getElementById(searchButtonId);
    const resultsContainer = document.getElementById(resultsContainerId);

    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim().toLowerCase();
        const filteredResults = data.filter(item => item[key] && item[key].toLowerCase().includes(query));
        displayResults(filteredResults, resultsContainer, isLab);
    });

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") searchButton.click();
    });
}

// Initialize searches
async function initializeSearch() {
    const professorsData = await fetchJSONData("doctor_locations.json");
    const labsData = await fetchJSONData("labs.json");

    setupSearch("professor-search", "professor-search-btn", "professor-results", professorsData, "Prof", false);
    setupSearch("labs-search", "labs-search-btn", "labs-results", labsData, "Name", true);
}

initializeSearch();
