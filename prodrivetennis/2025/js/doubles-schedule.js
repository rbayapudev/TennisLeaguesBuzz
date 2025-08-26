import { doublesParticipants, doublesTeamsGroups, doublesMatches } from "./player-registrants.js";
import * as Utils from './utils.js';

// Function to display the schedules on the page
function displaySchedules() {
    const scheduleContainer = document.getElementById('schedule-container');

    if (!scheduleContainer) {
        console.error("Error: 'schedule-container' element not found in the DOM.");
        return;
    }

    if (!doublesTeamsGroups || doublesTeamsGroups.length === 0) {
        scheduleContainer.innerHTML = '<p class="text-red-300 text-lg">No doubles team group data available to generate schedule.</p>';
        console.warn("No doubles team group data available.");
        return;
    }

    // construct singles players map
    const playersById = Utils.arrayToMap(doublesParticipants, 'id');
    // construct groupedMatches
    const groupedMatches = Utils.groupMatchesByRoundAndGroupForDoubles(doublesMatches, playersById);
    const MAX_ROUND = 2;

    for(let round = 1; round <= MAX_ROUND; round++) {
        const roundMatches = groupedMatches[round];
        if((round == 1) && roundMatches) {
            scheduleContainer.appendChild(renderTitle("Round 1 - Round Robin"));
            for (let index = 0; index < doublesTeamsGroups.length; index++) {
                //const group = doublesTeamsGroups[index];
                //const groupSchedule = Utils.generateRoundRobinScheduleForDoubles(group);
                const groupLetter = String.fromCharCode(65 + index); // Group A, B, etc.
                const groupedMatchesByWeek = Utils.groupMatchesByWeek(roundMatches[groupLetter]);
                const groupDiv = document.createElement('div');
                groupDiv.className = 'group-schedule-card'; // Apply custom styling
                groupDiv.innerHTML = _renderInnerHtmlFromObj(groupLetter, groupedMatchesByWeek);
                scheduleContainer.appendChild(groupDiv);
            }
        }
        else {
            const playOffScheduleContainer = document.getElementById('playoff-schedule-container');
            if((round == 2) && roundMatches) {
                // display the round - 2 schedule
                playOffScheduleContainer.appendChild(renderTitle("Round 2 - Semi Finals"));
                const groupDiv = document.createElement('div');
                groupDiv.className = 'group-schedule-card'; // Apply custom styling
                groupDiv.innerHTML = _renderPlayoffInnerHtmlFromObj("SF", roundMatches);
                playOffScheduleContainer.appendChild(groupDiv);
            }
        }
    }
}

function renderTitle(title) {
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = `
        <h2 class="text-2xl font-bold text-white mb-4">${title}</h2>
    `;
    return titleDiv;
}


function _renderPlayoffInnerHtmlFromObj(title, roundMatches) {
    return `
        <h2 class="text-2xl font-bold text-white mb-4">${title} Schedule</h2>
        <div class="overflow-x-auto">
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Match</th>
                        <th>Player 1</th>
                        <th>Player 2</th>
                        <th>Score</th>
                    </tr>
                </thead>              
                <tbody>
                    ${Object.entries(roundMatches).map(([key, value]) => {
                        const weekIndex = key;
                        const weekMatches = value;
                        const rowspan = weekMatches.length;
                
                        return weekMatches.map((match, matchIndex) => {
                            // Check if player1 or player2 is the winner
                            const team1IsWinner = match.winnerId === match.team1.id;
                            const team2IsWinner = match.winnerId === match.team2.id;
                            
                            // Add a CSS class based on who won
                            const team1Class = team1IsWinner ? 'winner' : 'nowinner';
                            const team2Class = team2IsWinner ? 'winner' : 'nowinner';
                
                            return `
                                <tr>
                                    ${matchIndex === 0 ? `<td rowspan="${rowspan}">${weekIndex}</td>` : ''}
                                    <td class="${team1Class}">${Utils.formatDoublesTeamName(match.team1)}</td>
                                    <td class="${team2Class}">${match.type === 'bye' ? 'BYE' : Utils.formatDoublesTeamName(match.team2)}</td>
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
                            const team1IsWinner = match.winnerId === match.team1.id;
                            const team2IsWinner = match.winnerId === match.team2.id;
                            
                            // Add a CSS class based on who won
                            const team1Class = team1IsWinner ? 'winner' : 'nowinner';
                            const team2Class = team2IsWinner ? 'winner' : 'nowinner';
                
                            return `
                                <tr>
                                    ${matchIndex === 0 ? `<td rowspan="${rowspan}">Week ${weekIndex}</td>` : ''}
                                    <td class="${team1Class}">${Utils.formatDoublesTeamName(match.team1)}</td>
                                    <td class="${team2Class}">${match.type === 'bye' ? 'BYE' : Utils.formatDoublesTeamName(match.team2)}</td>
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
