// List of all tennis players
const players = [
    "Abhinav Sathiamoorthy", "Anjana Srivastava", "Bindusha Bommareddy",
    "Brian Demar Jones", "Cameron Stabile", "Gitesh Nandre",
    "Joshua Nasman", "Kevin McCauley", "Leah Kazenmayer",
    "Noah Sung", "Paola Donis Noriega", "Riccardo Consolo",
    "Robbie Gold", "Saurabh Gujare", "Sean Murphy",
    "Shubham Mankar", "Tanner Bradford", "Trenton Squires",
    "Yeshwanth Devara", "Zeeshan Khan"
];

// Number of groups desired
const numGroups = 4; // This variable is not used in the provided JS, but kept for context.
const playerGroups = [
    [
        "Kevin McCauley",
        "Sean Murphy",
        "Riccardo Consolo",
        "Shubham Mankar",
        "Yeshwanth Devara"
    ],
    [
        "Saurabh Gujare",
        "Gitesh Nandre",
        "Leah Kazenmayer",
        "Bindusha Bommareddy",
        "Trenton Squires"
    ],
    [
        "Anjana Srivastava",
        "Noah Sung",
        "Robbie Gold",
        "Paola Donis Noriega",
        "Cameron Stabile"
    ],
    [
        "Tanner Bradford",
        "Abhinav Sathiamoorthy",
        "Brian Demar Jones",
        "Zeeshan Khan",
        "Joshua Nasman"
    ]
];

// Display groups on the page
const groupsContainer = document.getElementById('groups-container');
playerGroups.forEach((group, index) => {
    const groupDiv = document.createElement('div');
    // Adjusted classes for better visibility on the new background
    groupDiv.className = 'bg-white bg-opacity-10 p-6 rounded-xl shadow-md border border-white border-opacity-30 text-left';
    groupDiv.innerHTML = `
        <h2 class="text-2xl font-bold text-white mb-4">Group ${String.fromCharCode(65 + index)}</h2>
        <ul class="list-disc list-inside space-y-2 text-gray-200">
            ${group.map(player => `<li class="text-lg">${player}</li>`).join('')}
        </ul>
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
