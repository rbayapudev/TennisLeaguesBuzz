// doublesTeamsGroups injected from outside
// Store groups in localStorage so the schedule page can access them
localStorage.setItem('doublesTeamsGroups', JSON.stringify(doublesTeamsGroups));

// Display groups on the page
const groupsContainer = document.getElementById('groups-container');
doublesTeamsGroups.forEach((group, index) => {
    const groupDiv = document.createElement('div');
    // Adjusted classes for better visibility on the new background
    groupDiv.className = 'bg-white bg-opacity-10 p-6 rounded-xl shadow-md border border-white border-opacity-30 text-left';
    groupDiv.innerHTML = `
        <h2 class="text-2xl font-bold text-white mb-4">Group ${String.fromCharCode(65 + index)}</h2>
        <div class="overflow-x-auto">
            <table class="team-table">
                <thead>
                    <tr>
                        <th>Team Name</th>
                        <th>Player 1</th>
                        <th>Player 2</th>
                    </tr>
                </thead>
                <tbody>
                    ${group.map((team, teamIdx) => `
                        <tr>
                            <td>Team ${groupLetter(index)}${teamIdx + 1}</td>
                            <td>${team.player1}</td>
                            <td>${team.player2}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    groupsContainer.appendChild(groupDiv);
});

// Helper function for group letter (A, B, C...)
function groupLetter(index) {
    return String.fromCharCode(65 + index);
}

// Dropdown toggle logic (copied from singles page for consistency)
document.addEventListener('DOMContentLoaded', function() {
    const groupsDropdownButton = document.getElementById('groupsDropdownButton');
    const dropdown = groupsDropdownButton.closest('.dropdown');

    groupsDropdownButton.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdown.classList.toggle('active');
    });

    window.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });
});
