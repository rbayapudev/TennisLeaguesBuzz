import { singlesParticipants, singlesPlayerGroups, singlesMatches } from "./player-registrants.js";

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

function arrayToMap(arr, keyProp) {
    const resultMap = new Map();
    arr.forEach(obj => {
        if(obj && obj.hasOwnProperty(keyProp)) {
            const key = obj[keyProp];
            resultMap.set(key, obj);
        } else {
            console.warn('object property missing');
        }
    });
    return resultMap;
}

function groupMatchesByRoundAndGroup(matches, playersById) {
    const groupedMatches = {};

    matches.forEach(match => {
        // update the player id objects
        match["player1"] = playersById.get(match["player1"]["id"]);
        match["player2"] = playersById.get(match["player2"]["id"]);

        // destructure the fields from the object
        const { round, group } = match;
        // ensure that 'round' key exists in the groupedMacthes
        if(!groupedMatches[round]) {
            groupedMatches[round] = {};
        }
        // ensure that 'group' key exists with in the 'round' object
        if(!groupedMatches[round][group]) {
            groupedMatches[round][group] = [];
        }
        groupedMatches[round][group].push(match);
    });
    return groupedMatches;
}

// return group matches by week
function groupMatchesByWeek(allMatches) {
    const weeks = {}; // Use an object to store matches, with week numbers as keys
  
    allMatches.forEach(match => {
      const weekNumber = match.scheduledFor;
      
      // If the week number doesn't exist as a key yet, create an empty array for it.
      if (!weeks[weekNumber]) {
        weeks[weekNumber] = [];
      }
  
      // Add the current match to the array for its corresponding week.
      weeks[weekNumber].push(match);
    });
  
    return weeks;
}

function formatScores(match) {
    const scores = [match.set1, match.set2, match.set3];
    
    // Filter out any empty strings, nulls, or undefined values
    const validScores = scores.filter(score => score);
    
    // Join the valid scores with a comma and a space
    return validScores.join(', ');
}

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
    const playersById = arrayToMap(singlesParticipants, 'id');
    // construct groupedMatches
    const groupedMatches = groupMatchesByRoundAndGroup(singlesMatches, playersById);
    const MAX_ROUND = 1;
    
    for(let round = 1; round <= MAX_ROUND; round++) {
        const roundMatches = groupedMatches[round];
        if(roundMatches) {
            for (let index = 0; index < singlesPlayerGroups.length; index++) {
                const group = singlesPlayerGroups[index];
                const groupLetter = String.fromCharCode(65 + index);
                const groupSchedule = generateRoundRobinSchedule(group);
                const groupedMatchesByWeek = groupMatchesByWeek(roundMatches[groupLetter]);
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
                                    <td>${match.type === 'bye' ? '' : formatScores(match)}</td>
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
