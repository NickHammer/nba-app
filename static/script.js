function fetchStats() {
    let playerName = document.getElementById('playerInput').value;
    
    fetch(`/get_stats?player=${playerName}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Player not found!");
                return;
            }

            console.log("Fetched Data:", data); // Debugging line to check data structure

            // Ensure stats is an array before iterating
            if (Array.isArray(data.stats)) {
                let statsTable = document.querySelector("#statsTable tbody");
                statsTable.innerHTML = "";

                data.stats.forEach(row => {
                    let tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${row.SEASON_ID}</td>
                        <td>${row.TEAM_ABBREVIATION}</td>
                        <td>${row.PTS}</td>
                        <td>${row.AST}</td>
                        <td>${row.REB}</td>
                    `;
                    statsTable.appendChild(tr);
                });
            } else {
                console.error("Stats data is not an array:", data.stats);
            }

            // Ensure awards is an array before iterating
            let awardsList = document.getElementById("awardsList");
            awardsList.innerHTML = "";

            if (Array.isArray(data.awards) && data.awards.length > 0) {
                data.awards.forEach(award => {
                    let li = document.createElement("li");
                    li.textContent = `${award.SEASON} - ${award.DESCRIPTION}`;
                    awardsList.appendChild(li);
                });
            } else {
                awardsList.innerHTML = "<li>No awards found for this player.</li>";
            }
        })
        .catch(error => console.error("Error fetching stats:", error));
}

// Store all player names (Fetched once from Flask on page load)
let playerNames = [];

// Fetch player names from Flask on load
document.addEventListener("DOMContentLoaded", function() {
    fetch("/get_all_players") // New API route to fetch player names
        .then(response => response.json())
        .then(data => {
            playerNames = data; // Store player names globally
        })
        .catch(error => console.error("Error fetching player list:", error));
});

// Function to filter player names
function filterPlayers() {
    let input = document.getElementById("playerInput").value.toLowerCase();
    let suggestions = document.getElementById("suggestions");
    
    // Clear previous results
    suggestions.innerHTML = "";
    
    if (input.length === 0) return; // Don't show suggestions when input is empty
    
    // Filter player names that contain the input string
    let filteredNames = playerNames.filter(name => name.toLowerCase().includes(input));
    
    // Display filtered results
    filteredNames.slice(0, 8).forEach(name => { // Limit to 8 results
        let div = document.createElement("div");
        div.textContent = name;
        div.classList.add("suggestion-item");
        
        // When clicking a name, set the input field value
        div.onclick = function() {
            document.getElementById("playerInput").value = name;
            suggestions.innerHTML = ""; // Clear suggestions
        };
        
        suggestions.appendChild(div);
    });
}

