// Function to generate round-robin schedule for a given group of teams
// For doubles, a "player" in the scheduling algorithm is a "team".
// The 'players' array here will actually be an array of team arrays (e.g., [["P1", "P2"], ["P3", "P4"]])
function generateRoundRobinSchedule(teams) {
    const numTeams = teams.length;
    const schedule = [];

    // If odd number of teams, add a 'BYE' team to make it even for scheduling
    const participants = [...teams]; // Each participant is a team array
    if (numTeams % 2 !== 0) {
        participants.push("BYE"); // 'BYE' will represent a team with a bye
    }

    const totalRounds = participants.length - 1; // Number of weeks
    const matchesPerRound = participants.length / 2;

    // Use the circle method for scheduling
    for (let round = 0; round < totalRounds; round++) {
        const weekMatches = [];
        for (let i = 0; i < matchesPerRound; i++) {
            const team1 = participants[i];
            const team2 = participants[participants.length - 1 - i];

            // Store matches as objects for easier rendering in table columns
            if (team1 !== "BYE" && team2 !== "BYE") {
                weekMatches.push({ team1: team1, team2: team2, type: 'match' });
            } else if (team1 === "BYE") {
                weekMatches.push({ team1: team2, team2: 'BYE', type: 'bye' }); // Team 2 has a BYE
            } else if (team2 === "BYE") {
                weekMatches.push({ team1: team1, team2: 'BYE', type: 'bye' }); // Team 1 has a BYE
            }
        }
        schedule.push(weekMatches);

        // Rotate teams: Keep the first team fixed, rotate the rest clockwise
        const lastTeam = participants.pop(); // Remove last team
        participants.splice(1, 0, lastTeam); // Insert it after the first team
    }
    return schedule;
}

// Doubles team group data directly embedded for independence
const doublesTeamsGroups = [
    [
        ["Ileen Thelen", "Mike"],
        ["Saurabh Gujare", "Trenton Squires"],
        ["Anjana Srivastava", "Abhinav Sathiamoorthy"],
        ["Tanner Bradford", "Tori York"],
        ["Bindusha Bommareddy", "Yeshwanth Devara"]
    ],
    [
        ["Cameron Stabile", "David Fern"],
        ["Brian Demar Jones", "Gitesh Nandre"],
        ["Riccardo Consolo", "Paola Donis Noriega"],
        ["Kevin McCauley", "Zeeshan Khan"],
        ["Dewi Nilamsari", "Noah Sung"]
    ]
];

// Function to display the schedules on the page
function displaySchedules() {
    console.log("displaySchedules function called for doubles.");
    const scheduleContainer = document.getElementById('schedule-container');

    if (!scheduleContainer) {
        console.error("Error: 'schedule-container' element not found in the DOM.");
        return;
    }

    if (doublesTeamsGroups.length === 0) {
        scheduleContainer.innerHTML = '<p class="text-red-300 text-lg">No doubles team group data available to generate schedule.</p>';
        console.warn("No doubles team group data available.");
        return;
    }

    for (let index = 0; index < doublesTeamsGroups.length; index++) {
        const group = doublesTeamsGroups[index];
        const groupLetter = String.fromCharCode(65 + index); // Group A, B, etc.
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
                            <th>Team 1</th>
                            <th>Team 2</th>
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
                                    <td>${match.type === 'bye' ? match.team1.join(' & ') : match.team1.join(' & ')}</td>
                                    <td>${match.type === 'bye' ? 'BYE' : match.team2.join(' & ')}</td>
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
    console.log("Doubles schedules should now be displayed.");
}

// Dropdown toggle logic (replicated for this page's navbar)
window.onload = function() {
    console.log("window.onload event fired for doubles schedule."); // Added log for debugging
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
