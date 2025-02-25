document.addEventListener("DOMContentLoaded", () => {
    const mainCampusBtn = document.getElementById("main-campus-btn");
    const mainCampusContent = document.getElementById("main-campus-content");
    const searchButtons = document.getElementById("search-buttons");
    const professorBtn = document.getElementById("professor-btn");
    const labsBtn = document.getElementById("labs-btn");
    const professorSearchContainer = document.getElementById("professor-search-container");
    const labsSearchContainer = document.getElementById("labs-search-container");

    function toggleSearch(active, inactive) {
        active.classList.add("active");
        inactive.classList.remove("active");
    }

    mainCampusBtn.addEventListener("click", () => {
        mainCampusContent.classList.remove("hidden");
        searchButtons.classList.remove("hidden");
    });

    professorBtn.addEventListener("click", () => {
        toggleSearch(professorSearchContainer, labsSearchContainer);
    });

    labsBtn.addEventListener("click", () => {
        toggleSearch(labsSearchContainer, professorSearchContainer);
    });

    async function fetchData(url) {
        try {
            const response = await fetch(url + "?v=" + new Date().getTime());
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);
            return await response.json();
        } catch (error) {
            console.error("❌ Error fetching data:", error);
            return [];
        }
    }

    function setupSearch(searchInputId, searchButtonId, resultsContainerId, data, key, isLab) {
        const searchInput = document.getElementById(searchInputId);
        const searchButton = document.getElementById(searchButtonId);
        const resultsContainer = document.getElementById(resultsContainerId);

        searchButton.addEventListener("click", () => {
            const query = searchInput.value.trim().toLowerCase();
            const filteredResults = data.filter(item => item[key] && item[key].toLowerCase().includes(query));

            resultsContainer.innerHTML = filteredResults.length
                ? filteredResults.map(result => `
                    <div>
                        <h3>${isLab ? result.Name : result.Prof}</h3>
                        <p><strong>Location:</strong> ${result.Location || result.location || "Unknown"}</p>
                        <p><strong>Description:</strong> ${result.description || "No description available"}</p>
                    </div>
                `).join("")
                : "<p>No results found.</p>";
        });

        searchInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") searchButton.click();
        });
    }

    async function initializeSearch() {
        const professorsData = await fetchData("doctor_locations.json");
        const labsData = await fetchData("labs.json");

        setupSearch("professor-search", "professor-search-btn", "professor-results", professorsData, "Prof", false);
        setupSearch("labs-search", "labs-search-btn", "labs-results", labsData, "Name", true);
    }

    initializeSearch();
});

