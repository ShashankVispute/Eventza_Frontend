// Global state management
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Club Member', status: 'active' }
];

let clubs = [
    { id: 1, name: 'Sports Club', category: 'Sports', members: 120, status: 'active' }
];

// Animation functions
function fadeIn(element) {
    element.style.opacity = '0';
    element.style.display = 'block';
    let opacity = 0;
    const timer = setInterval(() => {
        if (opacity >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = opacity;
        opacity += 0.1;
    }, 20);
}

function fadeOut(element, callback) {
    let opacity = 1;
    const timer = setInterval(() => {
        if (opacity <= 0) {
            clearInterval(timer);
            element.style.display = 'none';
            if (callback) callback();
        }
        element.style.opacity = opacity;
        opacity -= 0.1;
    }, 20);
}

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    fadeIn(modal);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    fadeOut(modal);
}

// User management functions
function showAddUserModal() {
    showModal('addUserModal');
}

function addUser(event) {
    event.preventDefault();
    const newUser = {
        id: users.length + 1,
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        status: 'active'
    };
    
    users.push(newUser);
    updateUserTable();
    closeModal('addUserModal');
    document.getElementById('addUserForm').reset();
    
    // Update total users count
    updateDashboardStats();
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        // Implement edit functionality
        console.log('Editing user:', user);
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        users = users.filter(u => u.id !== userId);
        updateUserTable();
        updateDashboardStats();
    }
}

function viewUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        // Implement view functionality
        console.log('Viewing user:', user);
    }
}

// Club management functions
function showAddClubModal() {
    showModal('addClubModal');
}

function addClub(event) {
    event.preventDefault();
    const newClub = {
        id: clubs.length + 1,
        name: document.getElementById('clubName').value,
        category: document.getElementById('clubCategory').value,
        members: 0,
        status: 'active'
    };
    
    clubs.push(newClub);
    updateClubTable();
    closeModal('addClubModal');
    document.getElementById('addClubForm').reset();
    
    // Update total clubs count
    updateDashboardStats();
}

function editClub(clubId) {
    const club = clubs.find(c => c.id === clubId);
    if (club) {
        // Implement edit functionality
        console.log('Editing club:', club);
    }
}

function deleteClub(clubId) {
    if (confirm('Are you sure you want to delete this club?')) {
        clubs = clubs.filter(c => c.id !== clubId);
        updateClubTable();
        updateDashboardStats();
    }
}

function viewClub(clubId) {
    const club = clubs.find(c => c.id === clubId);
    if (club) {
        // Implement view functionality
        console.log('Viewing club:', club);
    }
}

// Table update functions
function updateUserTable() {
    const tbody = document.querySelector('.data-table tbody');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="status-badge status-${user.status}">${user.status}</span></td>
            <td>
                <button class="action-btn view-btn" onclick="viewUser(${user.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit-btn" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateClubTable() {
    const tbody = document.querySelectorAll('.data-table tbody')[1];
    tbody.innerHTML = clubs.map(club => `
        <tr>
            <td>${club.name}</td>
            <td>${club.category}</td>
            <td>${club.members}</td>
            <td><span class="status-badge status-${club.status}">${club.status}</span></td>
            <td>
                <button class="action-btn view-btn" onclick="viewClub(${club.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit-btn" onclick="editClub(${club.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteClub(${club.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Dashboard stats update
function updateDashboardStats() {
    document.querySelector('.card-value').textContent = users.length;
    document.querySelectorAll('.card-value')[1].textContent = clubs.length;
    document.querySelectorAll('.card-value')[2].textContent = '8'; // Active events
    document.querySelectorAll('.card-value')[3].textContent = '₹45,500'; // Total revenue
}

// Logout function
function logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // Show notification
        showNotification('Logging out...', 'info');
        
        // Clear user session data
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminName');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'admin-login.html';
        }, 1500);
    }
}

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Management
let events = [
    {
        id: 1,
        name: "Annual Sports Meet",
        club: "Sports Club",
        date: "2024-03-15T10:00",
        venue: "Main Stadium",
        status: "upcoming",
        description: "Annual sports competition for all clubs",
        capacity: 200
    }
];

function showAddEventModal() {
    // Populate clubs dropdown
    const clubSelect = document.getElementById('eventClub');
    clubSelect.innerHTML = '<option value="">Select Club</option>';
    clubs.forEach(club => {
        clubSelect.innerHTML += `<option value="${club.id}">${club.name}</option>`;
    });
    showModal('addEventModal');
}

function addEvent(event) {
    event.preventDefault();
    const newEvent = {
        id: events.length + 1,
        name: document.getElementById('eventName').value,
        club: document.getElementById('eventClub').options[document.getElementById('eventClub').selectedIndex].text,
        date: document.getElementById('eventDate').value,
        venue: document.getElementById('eventVenue').value,
        status: "upcoming",
        description: document.getElementById('eventDescription').value,
        capacity: parseInt(document.getElementById('eventCapacity').value)
    };
    
    events.push(newEvent);
    updateEventTable();
    closeModal('addEventModal');
    document.getElementById('addEventForm').reset();
    updateDashboardStats();
}

function updateEventTable() {
    const tbody = document.getElementById('eventsTableBody');
    tbody.innerHTML = events.map(event => `
        <tr>
            <td>${event.name}</td>
            <td>${event.club}</td>
            <td>${new Date(event.date).toLocaleString()}</td>
            <td>${event.venue}</td>
            <td><span class="event-status status-${event.status}">${event.status}</span></td>
            <td>
                <button class="action-btn view-btn" onclick="viewEvent(${event.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit-btn" onclick="editEvent(${event.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteEvent(${event.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        // Implement view functionality
        console.log('Viewing event:', event);
    }
}

function editEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        // Implement edit functionality
        console.log('Editing event:', event);
    }
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        events = events.filter(e => e.id !== eventId);
        updateEventTable();
        updateDashboardStats();
    }
}

// Analytics
let charts = {};
let isAnalyticsInitialized = false;

function initializeCharts() {
    if (isAnalyticsInitialized) return;
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 20
                }
            }
        }
    };

    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart');
    if (userGrowthCtx) {
        charts.userGrowth = new Chart(userGrowthCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Users',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Event Participation Chart
    const eventParticipationCtx = document.getElementById('eventParticipationChart');
    if (eventParticipationCtx) {
        charts.eventParticipation = new Chart(eventParticipationCtx, {
            type: 'bar',
            data: {
                labels: ['Sports', 'Cultural', 'Academic', 'Technical'],
                datasets: [{
                    label: 'Participants',
                    data: [120, 190, 80, 150],
                    backgroundColor: ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2']
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        charts.revenue = new Chart(revenueCtx, {
            type: 'doughnut',
            data: {
                labels: ['Events', 'Memberships', 'Donations', 'Other'],
                datasets: [{
                    data: [30000, 10000, 5000, 500],
                    backgroundColor: ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2']
                }]
            },
            options: {
                ...chartOptions,
                cutout: '60%'
            }
        });
    }

    // Club Activity Chart
    const clubActivityCtx = document.getElementById('clubActivityChart');
    if (clubActivityCtx) {
        charts.clubActivity = new Chart(clubActivityCtx, {
            type: 'radar',
            data: {
                labels: ['Events', 'Members', 'Participation', 'Revenue', 'Growth'],
                datasets: [{
                    label: 'Sports Club',
                    data: [65, 75, 70, 80, 60],
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    pointBackgroundColor: '#1976d2'
                }, {
                    label: 'Cultural Club',
                    data: [80, 60, 75, 70, 65],
                    borderColor: '#388e3c',
                    backgroundColor: 'rgba(56, 142, 60, 0.1)',
                    pointBackgroundColor: '#388e3c'
                }]
            },
            options: {
                ...chartOptions,
                scales: {
                    r: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 20
                        }
                    }
                }
            }
        });
    }

    isAnalyticsInitialized = true;
}

function updateAnalytics() {
    const timeRange = document.getElementById('analyticsTimeRange').value;
    
    // Simulate data update based on time range
    const newData = generateAnalyticsData(timeRange);
    
    // Update each chart with new data
    if (charts.userGrowth) {
        charts.userGrowth.data.datasets[0].data = newData.userGrowth;
        charts.userGrowth.update();
    }
    
    if (charts.eventParticipation) {
        charts.eventParticipation.data.datasets[0].data = newData.eventParticipation;
        charts.eventParticipation.update();
    }
    
    if (charts.revenue) {
        charts.revenue.data.datasets[0].data = newData.revenue;
        charts.revenue.update();
    }
    
    if (charts.clubActivity) {
        charts.clubActivity.data.datasets[0].data = newData.clubActivity.sports;
        charts.clubActivity.data.datasets[1].data = newData.clubActivity.cultural;
        charts.clubActivity.update();
    }
}

function generateAnalyticsData(timeRange) {
    // Generate realistic data based on time range
    const days = parseInt(timeRange);
    const baseData = {
        userGrowth: [65, 59, 80, 81, 56, 55],
        eventParticipation: [120, 190, 80, 150],
        revenue: [30000, 10000, 5000, 500],
        clubActivity: {
            sports: [65, 75, 70, 80, 60],
            cultural: [80, 60, 75, 70, 65]
        }
    };

    // Scale data based on time range
    const scaleFactor = days / 30; // Normalize to 30 days
    return {
        userGrowth: baseData.userGrowth.map(value => Math.round(value * scaleFactor)),
        eventParticipation: baseData.eventParticipation.map(value => Math.round(value * scaleFactor)),
        revenue: baseData.revenue.map(value => Math.round(value * scaleFactor)),
        clubActivity: {
            sports: baseData.clubActivity.sports.map(value => Math.round(value * scaleFactor)),
            cultural: baseData.clubActivity.cultural.map(value => Math.round(value * scaleFactor))
        }
    };
}

// Add resize handler to prevent infinite expansion
window.addEventListener('resize', () => {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
});

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize existing functionality
    updateUserTable();
    updateClubTable();
    updateEventTable();
    updateDashboardStats();

    // Initialize charts with a small delay to ensure DOM is ready
    setTimeout(() => {
        initializeCharts();
    }, 100);

    // Add form submit listeners
    document.getElementById('addUserForm').addEventListener('submit', addUser);
    document.getElementById('addClubForm').addEventListener('submit', addClub);
    document.getElementById('addEventForm').addEventListener('submit', addEvent);

    // Add animation to dashboard cards
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`;
    });
}); 