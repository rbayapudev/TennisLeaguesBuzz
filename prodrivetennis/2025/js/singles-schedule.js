import { singlesParticipants, singlesPlayerGroups, singlesMatches } from "./player-registrants.js";
import * as Utils from './utils.js';

// Function to display the schedules on the page
function displaySchedules() {
    const scheduleContainer = document.getElementById('schedule-container');

    if (!scheduleContainer) {
        console.error("Error: 'schedule-container' element not found in the DOM.");
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
    const MAX_ROUND = 1;
    
    for(let round = 1; round <= MAX_ROUND; round++) {
        const roundMatches = groupedMatches[round];
        if(roundMatches) {
            for (let index = 0; index < singlesPlayerGroups.length; index++) {
                //const group = singlesPlayerGroups[index];
                //const groupSchedule = Utils.generateRoundRobinSchedule(group);
                const groupLetter = String.fromCharCode(65 + index);
                const groupedMatchesByWeek = Utils.groupMatchesByWeek(roundMatches[groupLetter]);
                const groupDiv = document.createElement('div');
                groupDiv.className = 'group-schedule-card'; // Apply custom styling
                //groupDiv.innerHTML = _renderInnerHtmlFromArr(groupLetter, groupSchedule);
                groupDiv.innerHTML = _renderInnerHtmlFromObj(groupLetter, groupedMatchesByWeek);
                scheduleContainer.appendChild(groupDiv);
            }
        }
    }
}

function _renderInnerHtmlFromObj(groupLetter, groupSchedule) {
    return `
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
                    ${Object.entries(groupSchedule).map(([key, value]) => {
                        const weekIndex = parseInt(key);
                        const weekMatches = value;
                        const rowspan = weekMatches.length;
                
                        return weekMatches.map((match, matchIndex) => {
                            // Check if player1 or player2 is the winner
                            const player1IsWinner = match.winnerId === match.player1.id;
                            const player2IsWinner = match.winnerId === match.player2.id;
                            
                            // Add a CSS class based on who won
                            const player1Class = player1IsWinner ? 'winner' : 'nowinner';
                            const player2Class = player2IsWinner ? 'winner' : 'nowinner';
                
                            return `
                                <tr>
                                    ${matchIndex === 0 ? `<td rowspan="${rowspan}">Week ${weekIndex}</td>` : ''}
                                    <td class="${player1Class}">${match.player1.name}</td>
                                    <td class="${player2Class}">${match.type === 'bye' ? 'BYE' : match.player2.name}</td>
                                    <td>${match.type === 'bye' ? '' : Utils.formatScores(match)}</td>
                                </tr>
                            `;
                        }).join('');
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function _renderInnerHtmlFromArr(groupLetter, groupSchedule) {
    return `
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
                                <td>${match.player1.name}</td>
                                <td>${match.type === 'bye' ? 'BYE' : match.player2.name}</td>
                                <td>${match.type === 'bye' ? '' : ' - '}</td> <!-- Placeholder for score -->
                            </tr>
                        `).join('');
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Dropdown toggle logic (replicated for this page's navbar)
window.onload = function() {
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
