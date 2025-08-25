import { singlesParticipants, singlesPlayerGroups, singlesMatches } from "./player-registrants.js";
import * as Utils from './utils.js';

// Display groups on the page
function displayRoundRobinGroups() {
    const groupsContainer = document.getElementById('groups-container');
    if (!groupsContainer) {
        console.error("Error: 'groups-container' element not found in the DOM.");
        return;
    }

    if (!singlesPlayerGroups || singlesPlayerGroups.length === 0) {
        scheduleContainer.innerHTML = '<p class="text-red-300 text-lg">No player group data available to generate schedule.</p>';
        console.warn("No player group data available.");
        return;
    }

    // construct singles players map
    const playersById = Utils.arrayToMap(singlesParticipants, 'id');
    // construct groupedMatches
    const groupedMatches = Utils.groupMatchesByRoundAndGroup(singlesMatches, playersById);
    // construct the player wins analysis
    var ROUND = 1;
    const playerIdToPlayerStats = Utils.getPlayerStatsByRound(singlesMatches, ROUND);
    
    const roundMatches = groupedMatches[ROUND];
    if(roundMatches) {
        for (let index = 0; index < singlesPlayerGroups.length; index++) {
            const group = singlesPlayerGroups[index];
            const groupWithPlayerStats = Utils.getGroupWithTeamStats(group, playerIdToPlayerStats);
            const sortedGroup = Utils.sortByField(groupWithPlayerStats, 'points', false);
            const groupLetter = String.fromCharCode(65 + index);
            const groupDiv = document.createElement('div');
            groupDiv.className = 'group-schedule-card'; // Apply custom styling
            debugger;
            groupDiv.innerHTML = _renderInnerHtmlFromObj(groupLetter, sortedGroup);
            groupsContainer.appendChild(groupDiv);
        }
    }
}

function _renderInnerHtmlFromObj(groupLetter, group) {
    return `
    <h2 class="text-2xl font-bold text-white mb-4">Group ${groupLetter}</h2>
    <div class="overflow-x-auto">
        <table class="team-table">
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Played</th>
                    <th>Won</th>
                    <th>Lost</th>
                    <th>Draw</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                ${group.map((player, index) => `
                    <tr>
                        <td>${player.name}</td>
                        <td>${player.played}</td>
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
}

window.onload = function() {
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
    // display the view
    displayRoundRobinGroups();
};
