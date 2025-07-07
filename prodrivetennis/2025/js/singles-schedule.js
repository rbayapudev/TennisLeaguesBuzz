// Function to generate round-robin schedule for a given group of players
function generateRoundRobinSchedule(players) {
    const numPlayers = players.length;
    const schedule = [];

    // If odd number of players, add a 'BYE' player to make it even for scheduling
    const participants = [...players];
    if (numPlayers % 2 !== 0) {
        participants.push("BYE");
    }

    const totalRounds = participants.length - 1; // Number of weeks
    const matchesPerRound = participants.length / 2;

    // Use the circle method for scheduling
    for (let round = 0; round < totalRounds; round++) {
        const weekMatches = [];
        for (let i = 0; i < matchesPerRound; i++) {
            const player1 = participants[i];
            const player2 = participants[participants.length - 1 - i];

            // Store matches as objects for easier rendering in table columns
            if (player1 !== "BYE" && player2 !== "BYE") {
                weekMatches.push({ player1: player1, player2: player2, type: 'match' });
            } else if (player1 === "BYE") {
                weekMatches.push({ player1: player2, player2: 'BYE', type: 'bye' }); // Player 2 has a BYE
            } else if (player2 === "BYE") {
                weekMatches.push({ player1: player1, player2: 'BYE', type: 'bye' }); // Player 1 has a BYE
            }
        }
        schedule.push(weekMatches);

        // Rotate players: Keep the first player fixed, rotate the rest clockwise
        const lastPlayer = participants.pop(); // Remove last player
        participants.splice(1, 0, lastPlayer); // Insert it after the first player
    }
    return schedule;
}

// Player group data directly embedded for independence
const playerGroups = [
    [
        "Kevin McCauley",
        "Riccardo Consolo",
        "Shubham Mankar",
        "Yeshwanth Devara"
    ],
    [
        "Saurabh Gujare",
        "Gitesh Nandre",
        "Leah Kazenmayer",
        "Bindusha Bommareddy",
        "Trenton Squires"
    ],
    [
        "Anjana Srivastava",
        "Noah Sung",
        "Robbie Gold",
        "Paola Donis Noriega",
        "Cameron Stabile"
    ],
    [
        "Tanner Bradford",
        "Abhinav Sathiamoorthy",
        "Brian Demar Jones",
        "Zeeshan Khan",
        "Joshua Nasman"
    ]
];

// Function to display the schedules on the page
function displaySchedules() {
    console.log("displaySchedules function called.");
    const scheduleContainer = document.getElementById('schedule-container');

    if (!scheduleContainer) {
        console.error("Error: 'schedule-container' element not found in the DOM.");
        return;
    }

    if (playerGroups.length === 0) {
        scheduleContainer.innerHTML = '<p class="text-red-300 text-lg">No player group data available to generate schedule.</p>';
        console.warn("No player group data available.");
        return;
    }

    for (let index = 0; index < playerGroups.length; index++) {
        const group = playerGroups[index];
        const groupLetter = String.fromCharCode(65 + index);
        const groupSchedule = generateRoundRobinSchedule(group);

        const groupDiv = document.createElement('div');
        groupDiv.className = 'group-schedule-card'; // Apply custom styling
        groupDiv.innerHTML = `
            <h2 class="text-2xl font-bold text-white mb-4">Group ${groupLetter} Schedule</h2>
            <div class="overflow-x-auto">
                <table class="schedule-table">
                    <thead>
                        <tr>
                            <th>Week</th>
                            <th>Player 1</th>
                            <th>Player 2</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${groupSchedule.map((weekMatches, weekIndex) => {
                            // Calculate rowspan for the week
                            const rowspan = weekMatches.length;
                            return weekMatches.map((match, matchIndex) => `
                                <tr>
                                    ${matchIndex === 0 ? `<td rowspan="${rowspan}">Week ${weekIndex + 1}</td>` : ''}
                                    <td>${match.player1}</td>
                                    <td>${match.type === 'bye' ? 'BYE' : match.player2}</td>
                                    <td>${match.type === 'bye' ? '' : ' - '}</td> <!-- Placeholder for score -->
                                </tr>
                            `).join('');
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        scheduleContainer.appendChild(groupDiv);
    }
    console.log("Schedules should now be displayed.");
}

// Dropdown toggle logic (replicated for this page's navbar)
window.onload = function() {
    console.log("window.onload event fired."); // Added log for debugging
    const groupsDropdownButton = document.getElementById('groupsDropdownButton');
    const dropdown = groupsDropdownButton.closest('.dropdown');

    if (groupsDropdownButton && dropdown) {
        groupsDropdownButton.addEventListener('click', function(event) {
            event.stopPropagation();
            dropdown.classList.toggle('active');
        });

        window.addEventListener('click', function(event) {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove('active');
            }
        });
    }

    // Call the function to display schedules when the DOM is ready
    displaySchedules();
};
