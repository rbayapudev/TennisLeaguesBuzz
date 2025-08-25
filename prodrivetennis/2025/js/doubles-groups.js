import { doublesParticipants, doublesTeamsGroups, doublesMatches } from "./player-registrants.js";
import * as Utils from './utils.js';

// Display groups on the page
function displayRoundRobinGroups() {
    const groupsContainer = document.getElementById('groups-container');
    if (!groupsContainer) {
        console.error("Error: 'groups-container' element not found in the DOM.");
        return;
    }

    if (!doublesTeamsGroups || doublesTeamsGroups.length === 0) {
        scheduleContainer.innerHTML = '<p class="text-red-300 text-lg">No player group data available to generate schedule.</p>';
        console.warn("No player group data available.");
        return;
    }

    // construct singles players map
    const playersById = Utils.arrayToMap(doublesParticipants, 'id');
    // construct groupedMatches
    const groupedMatches = Utils.groupMatchesByRoundAndGroupForDoubles(doublesMatches, playersById);
    // construct the player wins analysis
    var ROUND = 1;
    const playerIdToPlayerStats = Utils.getTeamStatsByRound(doublesMatches, ROUND);
    
    const roundMatches = groupedMatches[ROUND];
    if(roundMatches) {
        for (let index = 0; index < doublesTeamsGroups.length; index++) {
            const group = doublesTeamsGroups[index];
            const groupWithPlayerStats = Utils.getGroupWithTeamStats(group, playerIdToPlayerStats);
            const sortedGroup = Utils.sortByField(groupWithPlayerStats, 'points', false);
            const groupLetter = String.fromCharCode(65 + index);
            const groupDiv = document.createElement('div');
            groupDiv.className = 'group-schedule-card'; // Apply custom styling
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
                        <td>${Utils.formatDoublesTeamName(player)}</td>
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

    groupsDropdownButton.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdown.classList.toggle('active');
    });

    window.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });
    // display the view
    displayRoundRobinGroups();
};  
