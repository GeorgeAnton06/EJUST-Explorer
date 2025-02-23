// Get elements
const mainCampusBtn = document.getElementById("main-campus-btn");
const secondaryCampusBtn = document.getElementById("secondary-campus-btn");
const mainCampusContent = document.getElementById("main-campus-content");
const secondaryCampusContent = document.getElementById("secondary-campus-content");

// Function to show campus content
function showCampusContent(showContent, hideContent) {
    hideContent.classList.remove("show"); // Start fade-out
    setTimeout(() => {
        hideContent.classList.add("hidden"); // Hide previous content
        showContent.classList.remove("hidden"); // Show new content
        setTimeout(() => {
            showContent.classList.add("show"); // Trigger fade-in effect
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
    event.stopPropagation(); // Prevent triggering the document click event
});

secondaryCampusBtn.addEventListener("click", (event) => {
    showCampusContent(secondaryCampusContent, mainCampusContent);
    event.stopPropagation(); // Prevent triggering the document click event
});

// Hide content when clicking anywhere outside
document.addEventListener("click", (event) => {
    if (!mainCampusContent.contains(event.target) && !secondaryCampusContent.contains(event.target) &&
        event.target !== mainCampusBtn && event.target !== secondaryCampusBtn) {
        hideCampusContent();
    }
});

// Function to fetch and parse CSV data
async function fetchCSVData() {
    try {
        const response = await fetch('./doctor_locations.json')
  .then(response => response.json())
  .then(data => {
    console.log("Successfully fetched data:", data);
    // Call the function that initializes buttons if needed
    initializeButtons();  // <- Ensure button logic is run AFTER data loads
  })
  .catch(error => console.error("Error fetching JSON:", error));
    }
    function initializeButtons() {
  document.querySelectorAll(".your-button-class").forEach(button => {
    button.addEventListener("click", function() {
      console.log("🔥 Button clicked:", this.textContent);
    });
  });
}

// Function to parse CSV data into an array of objects
function parseCSV(csvText) {
    // Remove BOM character if present
    if (csvText.charCodeAt(0) === 0xFEFF) {
        csvText = csvText.slice(1);
    }

    const rows = csvText.split('\n').slice(1); // Remove header row
    console.log('Parsed Rows:', rows); // Debug: Log parsed rows
    return rows.map(row => {
        const [prof, location, description] = row.split(',').map(item => item.trim()); // Trim extra spaces
        return { prof, location, description };
    });
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

// Function to handle search
function setupSearch(searchInputId, searchButtonId, resultsContainerId, data) {
    const searchInput = document.getElementById(searchInputId);
    const searchButton = document.getElementById(searchButtonId);
    const resultsContainer = document.getElementById(resultsContainerId);

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim().toLowerCase();
        const filteredResults = data.filter(item => item.prof.toLowerCase().includes(query));
        displayResults(filteredResults, resultsContainer);
    });

    // Optional: Allow pressing "Enter" to search
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchButton.click(); // Trigger the search button click
        }
    });
}

// Main function to initialize everything
async function initializeSearch() {
    const csvData = await fetchCSVData('D:\Key Skills project\Doctor locations.csv?v='); // Fetch CSV data
    const parsedData = parseCSV(csvData); // Parse CSV data
    console.log('Parsed Data:', parsedData); // Debug: Log parsed data

    // Set up search for Main Campus
    setupSearch('main-search', 'main-search-btn', 'main-results', parsedData);

    // Set up search for Secondary Campus
    setupSearch('secondary-search', 'secondary-search-btn', 'secondary-results', parsedData);
}

// Call the initialize function when the page loads
window.addEventListener('load', initializeSearch);
