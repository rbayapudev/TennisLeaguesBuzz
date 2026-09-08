import { singlesParticipants, doublesParticipants } from "./player-registrants.js";

// Function to populate the singles table
function populateSinglesTable() {
    const tbody = document.querySelector('#singles .custom-table tbody');
    if (!tbody) {
        console.error("Singles table body not found.");
        return;
    }
    tbody.innerHTML = singlesParticipants.map(player => `
        <tr>
            <td>${player.id}</td>
            <td>${player.name}</td>
            <td>${player.email}</td>
            <td>${player.phone}</td>
        </tr>
    `).join('');
}

// Function to populate the doubles table
function populateDoublesTable() {
    const tbody = document.querySelector('#doubles .custom-table tbody');
    if (!tbody) {
        console.error("Doubles table body not found.");
        return;
    }
    tbody.innerHTML = doublesParticipants.map(team => `
        <tr>
            <td>${team.id}</td>
            <td>${team.player1}</td>
            <td>${team.email1}</td>
            <td>${team.phone1}</td>
            <td>${team.player2}</td>
            <td>${team.email2}</td>
            <td>${team.phone2}</td>
        </tr>
    `).join('');
}

// Function to handle tab switching
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");

    if (tabName === 'singles') {
        populateSinglesTable();
    } else if (tabName === 'doubles') {
        populateDoublesTable();
    }
}

// Dropdown toggle logic for "Schedules" and "Groups" in the navbar
window.onload = function() {
    const schedulesDropdownButton = document.getElementById('schedulesDropdownButton');
    const schedulesDropdown = schedulesDropdownButton ? schedulesDropdownButton.closest('.dropdown') : null;

    if (schedulesDropdownButton && schedulesDropdown) {
        schedulesDropdownButton.addEventListener('click', function(event) {
            event.stopPropagation();
            schedulesDropdown.classList.toggle('active');
        });
    }

    const groupsDropdownButton = document.getElementById('groupsDropdownButton');
    const groupsDropdown = groupsDropdownButton ? groupsDropdownButton.closest('.dropdown') : null;

    if (groupsDropdownButton && groupsDropdown) {
        groupsDropdownButton.addEventListener('click', function(event) {
            event.stopPropagation();
            groupsDropdown.classList.toggle('active');
        });
    }

    window.addEventListener('click', function(event) {
        if (schedulesDropdown && !schedulesDropdown.contains(event.target)) {
            schedulesDropdown.classList.remove('active');
        }
        if (groupsDropdown && !groupsDropdown.contains(event.target)) {
            groupsDropdown.classList.remove('active');
        }
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const tabName = this.textContent.toLowerCase().includes('singles') ? 'singles' : 'doubles';
            openTab(event, tabName);
        });
    });

    const defaultTabButton = document.querySelector('.tab-button');
    if (defaultTabButton) {
        defaultTabButton.click();
    }
};
