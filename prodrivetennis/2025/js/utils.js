// common util functions

export function arrayToMap(arr, keyProp) {
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

export function formatScores(match) {
    const scores = [match.set1, match.set2, match.set3];
    
    // Filter out any empty strings, nulls, or undefined values
    const validScores = scores.filter(score => score);
    
    // Join the valid scores with a comma and a space
    return validScores.join(', ');
}

export function formatDoublesTeamName(team) {
    const playerNames = [team.player1, team.player2];
    
    // Join the valid scores with a comma and a space
    return playerNames.join(', ');
}

// return group matches by week
export function groupMatchesByWeek(allMatches) {
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

export function groupMatchesByRoundAndGroup(matches, playersById) {
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

export function groupMatchesByRoundAndGroupForDoubles(matches, playersById) {
    const groupedMatches = {};

    matches.forEach(match => {
        // update the player id objects
        match["team1"] = playersById.get(match["team1"]["id"]);
        match["team2"] = playersById.get(match["team2"]["id"]);

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

// Function to generate round-robin schedule for a given group of players
export function generateRoundRobinSchedule(players) {
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

// Function to generate round-robin schedule for a given group of teams
// For doubles, a "player" in the scheduling algorithm is a "team".
// The 'players' array here will actually be an array of team arrays (e.g., [["P1", "P2"], ["P3", "P4"]])
export function generateRoundRobinScheduleForDoubles(teams) {
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
