// Get elements
const mainCampusBtn = document.getElementById("main-campus-btn");
const secondaryCampusBtn = document.getElementById("secondary-campus-btn");
const mainCampusContent = document.getElementById("main-campus-content");
const secondaryCampusContent = document.getElementById("secondary-campus-content");
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

// Function to hide both contents
function hideCampusContent() {
    mainCampusContent.classList.remove("show");
    secondaryCampusContent.classList.remove("show");
    setTimeout(() => {
        mainCampusContent.classList.add("hidden");
        secondaryCampusContent.classList.add("hidden");
    }, 500);
}

// Event listeners for main and secondary campus buttons
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
        professorSearchContainer.classList.add("hidden");
        labsSearchContainer.classList.add("hidden");
    }
});

// Function to toggle search bars
function toggleSearch(active, inactive) {
    active.classList.toggle("hidden");
    inactive.classList.add("hidden");
}

// Ensure buttons are functional
if (professorBtn && labsBtn) {
    professorBtn.addEventListener("click", () => {
        toggleSearch(professorSearchContainer, labsSearchContainer);
    });
    labsBtn.addEventListener("click", () => {
        toggleSearch(labsSearchContainer, professorSearchContainer);
    });
}

// Function to fetch JSON data
async function fetchJSONData(url) {
    try {
        const response = await fetch(url + "?v=" + new Date().getTime());
        if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("❌ Error fetching JSON:", error);
        return [];
    }
}

// Function to display search results
function displayResults(results, resultsContainer) {
    resultsContainer.innerHTML = "";
    if (results.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }
    results.forEach(result => {
        const resultDiv = document.createElement("div");
        resultDiv.innerHTML = `
            <h3>${result.Prof || "Unknown"}</h3>
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

    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim().toLowerCase();
        const filteredResults = data.filter(item => item.Prof && item.Prof.toLowerCase().includes(query));
        displayResults(filteredResults, resultsContainer);
    });

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            searchButton.click();
        }
    });
}

// Main function to initialize everything
async function initializeSearch() {
    const jsonData = await fetchJSONData("doctor_locations.json");
    const labsData = await fetchJSONData("labs.json");
    
    setupSearch("professor-search", "professor-search-btn", "professor-results", jsonData);
    setupSearch("labs-search", "labs-search-btn", "labs-results", labsData);
}

// Call the initialize function when the page loads
window.addEventListener("DOMContentLoaded", initializeSearch);
