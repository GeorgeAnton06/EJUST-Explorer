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
mainCampusBtn.addEventListener("click", (event) => {
    showCampusContent(mainCampusContent, secondaryCampusContent);
    event.stopPropagation();
});

secondaryCampusBtn.addEventListener("click", (event) => {
    showCampusContent(secondaryCampusContent, mainCampusContent);
    event.stopPropagation();
});

// Hide content when clicking outside
document.addEventListener("click", (event) => {
    if (!mainCampusContent.contains(event.target) && !secondaryCampusContent.contains(event.target) &&
        event.target !== mainCampusBtn && event.target !== secondaryCampusBtn) {
        hideCampusContent();
    }
});

// Function to fetch and load JSON data
async function fetchJSONData() {
    try {
        const response = await fetch('./data/doctor_locations.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error('Failed to fetch JSON file');
        const data = await response.json();
        console.log('Fetched JSON Data:', data); // Debugging
        return data;
    } catch (error) {  // 🛠️ This is the missing catch block
        console.error('Error fetching JSON:', error);
        return [];  // Return an empty array to prevent crashes
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
            <h3>${result.prof}</h3>
            <p><strong>Location:</strong> ${result.location}</p>
            <p><strong>Description:</strong> ${result.description}</p>
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
        const filteredResults = data.filter(item => item.prof.toLowerCase().includes(query));
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

    // Set up search for Main Campus
    setupSearch('main-search', 'main-search-btn', 'main-results', jsonData);

    // Set up search for Secondary Campus
    setupSearch('secondary-search', 'secondary-search-btn', 'secondary-results', jsonData);
}

// Call the initialize function when the page loads
window.addEventListener('load', initializeSearch);

