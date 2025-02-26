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
    if (showElement.classList.contains("hidden")) {
        showElement.classList.remove("hidden");
        hideElement.classList.add("hidden");
    } else {
        showElement.classList.add("hidden");
    }
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
    if (!mainCampusContent.contains(event.target) && !secondaryCampusContent.contains(event.target) &&
        event.target !== mainCampusBtn && event.target !== secondaryCampusBtn) {
        mainCampusContent.classList.add("hidden");
        secondaryCampusContent.classList.add("hidden");
    }
    if (!professorsSearchContainer.contains(event.target) && !labsSearchContainer.contains(event.target) &&
        event.target !== searchProfessorsBtn && event.target !== searchLabsBtn) {
        professorsSearchContainer.classList.add("hidden");
        labsSearchContainer.classList.add("hidden");
    }
});

// Call the initialize function when the page loads
window.addEventListener("DOMContentLoaded", () => {
    professorsSearchContainer.classList.add("hidden");
    labsSearchContainer.classList.add("hidden");
});

