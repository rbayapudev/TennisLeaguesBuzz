import { singlesPlayerGroups } from "./player-registrants.js";

// Display groups on the page
const groupsContainer = document.getElementById('groups-container');
singlesPlayerGroups.forEach((group, index) => {
    const groupDiv = document.createElement('div');
    // Adjusted classes for better visibility on the new background
    groupDiv.className = 'bg-white bg-opacity-10 p-6 rounded-xl shadow-md border border-white border-opacity-30 text-left';
    groupDiv.innerHTML = `
        <h2 class="text-2xl font-bold text-white mb-4">Group ${String.fromCharCode(65 + index)}</h2>
        <div class="overflow-x-auto">
            <table class="team-table">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Won</th>
                        <th>Lost</th>
                        <th>Draw</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    ${group.map((player, teamIdx) => `
                        <tr>
                            <td>${player.name}</td>
                            <td>${player.won}</td>
                            <td>${player.lost}</td>
                            <td>${player.draw}</td>
                            <td>${player.points}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    groupsContainer.appendChild(groupDiv);
});

// Dropdown toggle logic
document.addEventListener('DOMContentLoaded', function() {
    const groupsDropdownButton = document.getElementById('groupsDropdownButton');
    const dropdown = groupsDropdownButton.closest('.dropdown');

    // This click listener is for accessibility (keyboard/touch)
    groupsDropdownButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent click from bubbling to window and closing immediately
        dropdown.classList.toggle('active');
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });
});
