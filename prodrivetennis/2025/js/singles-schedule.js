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

            // Only add a match if neither player is 'BYE'
            if (player1 !== "BYE" && player2 !== "BYE") {
                weekMatches.push(`${player1} vs ${player2}`);
            } else if (player1 === "BYE") {
                weekMatches.push(`${player2} has a BYE`);
            } else if (player2 === "BYE") {
                weekMatches.push(`${player1} has a BYE`);
            }
        }
        schedule.push(weekMatches);

        // Rotate players: Keep the first player fixed, rotate the rest clockwise
        const lastPlayer = participants.pop(); // Remove last player
        participants.splice(1, 0, lastPlayer); // Insert it after the first player
    }
    return schedule;
}

// Function to display the schedules on the page
function displaySchedules() {
    const scheduleContainer = document.getElementById('schedule-container');
    const playerGroupsJSON = localStorage.getItem('tennisPlayerGroups');

    if (!playerGroupsJSON) {
        scheduleContainer.innerHTML = '<p class="text-red-300 text-lg">Player group data not found in local storage. Please visit the Singles Groups page first.</p>';
        return;
    }

    const playerGroups = JSON.parse(playerGroupsJSON);

    playerGroups.forEach((group, index) => {
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
                            <th>Matches</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${groupSchedule.map((weekMatches, weekIndex) => `
                            <tr>
                                <td>Week ${weekIndex + 1}</td>
                                <td>
                                    <ul class="list-disc list-inside space-y-1">
                                        ${weekMatches.map(match => `<li>${match}</li>`).join('')}
                                    </ul>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        scheduleContainer.appendChild(groupDiv);
    });
}

// Dropdown toggle logic (replicated for this page's navbar)
document.addEventListener('DOMContentLoaded', function() {
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
});
