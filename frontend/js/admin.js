// Admin Dashboard JavaScript

// Authentication Check
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const adminEmail = localStorage.getItem('adminEmail');
    
    if (!isLoggedIn || adminEmail !== 'shashankvispute100@gmail.com') {
        // Redirect to login page if not authenticated
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Check authentication before proceeding
if (!checkAuth()) {
    // Stop execution if not authenticated
    throw new Error('Not authenticated');
}

// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const adminSidebar = document.querySelector('.admin-sidebar');
const searchInput = document.querySelector('.admin-search input');
const addEventButton = document.querySelector('.btn-primary');
const filterButton = document.querySelector('.btn-icon .fa-filter');
const viewAllButton = document.querySelector('.btn-text');
const editButtons = document.querySelectorAll('.btn-icon .fa-edit');
const deleteButtons = document.querySelectorAll('.btn-icon .fa-trash');
const viewButtons = document.querySelectorAll('.btn-icon .fa-eye');
const addEventModal = document.getElementById('add-event-modal');
const closeModalButtons = document.querySelectorAll('.close-btn');
const filterForm = document.getElementById('filter-form');

// State Management
let currentEvents = [];
let currentFilters = {
    status: 'all',
    date: 'all',
    club: 'all'
};

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    adminSidebar.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!adminSidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            adminSidebar.classList.remove('active');
        }
    }
});

// Search functionality with debouncing
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const searchTerm = e.target.value.toLowerCase();
        filterEvents(searchTerm);
    }, 300);
});

// Filter Events
function filterEvents(searchTerm = '') {
    const filteredEvents = currentEvents.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm) ||
                            event.club.toLowerCase().includes(searchTerm);
        const matchesStatus = currentFilters.status === 'all' || event.status === currentFilters.status;
        const matchesDate = currentFilters.date === 'all' || event.date === currentFilters.date;
        const matchesClub = currentFilters.club === 'all' || event.club === currentFilters.club;
        
        return matchesSearch && matchesStatus && matchesDate && matchesClub;
    });
    
    updateEventsTable(filteredEvents);
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        hideModal(e.target.id);
    }
});

// Close modal buttons
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        hideModal(modal.id);
    });
});

// Filter Button Click
filterButton.addEventListener('click', () => {
    showModal('filter-modal');
});

// Filter Form Submit
filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(filterForm);
    currentFilters = {
        status: formData.get('status-filter'),
        date: formData.get('date-filter'),
        club: formData.get('club-filter')
    };
    filterEvents();
    hideModal('filter-modal');
    showNotification('Filters applied successfully', 'success');
});

// View All Button Click
viewAllButton.addEventListener('click', () => {
    // Show all activity in a modal
    const allActivity = document.createElement('div');
    allActivity.className = 'modal';
    allActivity.id = 'all-activity-modal';
    allActivity.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>All Activity</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="activity-list">
                    ${generateAllActivityHTML()}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(allActivity);
    showModal('all-activity-modal');
});

// Generate HTML for all activity
function generateAllActivityHTML() {
    // This would typically come from your backend
    const activities = [
        {
            icon: 'user-plus',
            text: '<strong>John Doe</strong> registered for <strong>Tech Workshop</strong>',
            time: '2 minutes ago'
        },
        {
            icon: 'money-bill-wave',
            text: 'Payment received for <strong>Cultural Festival</strong>',
            time: '15 minutes ago'
        },
        {
            icon: 'calendar-plus',
            text: 'New event <strong>Business Summit</strong> created',
            time: '1 hour ago'
        },
        {
            icon: 'user-check',
            text: '5 registrations approved for <strong>Tech Workshop</strong>',
            time: '2 hours ago'
        },
        {
            icon: 'calendar-check',
            text: 'Event <strong>Sports Day</strong> completed successfully',
            time: '3 hours ago'
        },
        {
            icon: 'exclamation-circle',
            text: 'Low attendance reported for <strong>Art Exhibition</strong>',
            time: '4 hours ago'
        }
    ];
    
    return activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.text}</p>
                <span>${activity.time}</span>
            </div>
        </div>
    `).join('');
}

// Add new event
addEventButton.addEventListener('click', () => {
    showModal('add-event-modal');
});

// Edit event
function handleEditEvent(eventId) {
    const event = currentEvents.find(e => e.id === eventId);
    if (event) {
        // Add loading state to button
        const button = document.querySelector(`.edit-btn[data-event-id="${eventId}"]`);
        button.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            // Populate edit form with event data
            document.getElementById('edit-event-name').value = event.name;
            document.getElementById('edit-event-club').value = event.club;
            document.getElementById('edit-event-date').value = event.date;
            document.getElementById('edit-event-capacity').value = event.capacity;
            document.getElementById('edit-event-description').value = event.description;
            document.querySelector('#edit-event-form input[name="event-id"]').value = event.id;
            
            // Remove loading state
            button.classList.remove('loading');
            
            // Show modal
            showModal('edit-event-modal');
        }, 500);
    }
}

// View event details
function handleViewEvent(eventId) {
    const event = currentEvents.find(e => e.id === eventId);
    if (event) {
        // Add loading state to button
        const button = document.querySelector(`.view-btn[data-event-id="${eventId}"]`);
        button.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            // Populate view form with event data
            document.getElementById('view-event-name').textContent = event.name;
            document.getElementById('view-event-club').textContent = event.club;
            document.getElementById('view-event-date').textContent = event.date;
            document.getElementById('view-event-capacity').textContent = event.capacity;
            document.getElementById('view-event-status').textContent = event.status;
            document.getElementById('view-event-description').textContent = event.description;
            
            // Remove loading state
            button.classList.remove('loading');
            
            // Show modal
            showModal('view-event-modal');
        }, 500);
    }
}

// Delete event with confirmation
function handleDeleteEvent(eventId) {
    const event = currentEvents.find(e => e.id === eventId);
    if (event) {
        const confirmDialog = document.createElement('div');
        confirmDialog.className = 'confirmation-dialog';
        confirmDialog.innerHTML = `
            <h3>Delete Event</h3>
            <p>Are you sure you want to delete "${event.name}"? This action cannot be undone.</p>
            <div class="actions">
                <button class="btn btn-secondary" onclick="this.closest('.confirmation-dialog').remove()">Cancel</button>
                <button class="btn btn-danger" onclick="confirmDeleteEvent(${eventId})">
                    <i class="fas fa-trash"></i>
                    <span>Delete</span>
                </button>
            </div>
        `;
        document.body.appendChild(confirmDialog);
    }
}

// Confirm delete event
function confirmDeleteEvent(eventId) {
    const button = document.querySelector(`.delete-btn[data-event-id="${eventId}"]`);
    button.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        currentEvents = currentEvents.filter(e => e.id !== eventId);
        updateEventsTable(currentEvents);
        updateDashboardStats();
        document.querySelector('.confirmation-dialog').remove();
        showNotification('Event deleted successfully', 'success');
        button.classList.remove('loading');
    }, 500);
}

// Form Submissions
document.getElementById('add-event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        const formData = new FormData(e.target);
        const newEvent = {
            id: Date.now(),
            name: formData.get('event-name'),
            club: formData.get('event-club'),
            date: formData.get('event-date'),
            capacity: formData.get('event-capacity'),
            description: formData.get('event-description'),
            status: 'upcoming'
        };
        
        currentEvents.push(newEvent);
        updateEventsTable(currentEvents);
        updateDashboardStats();
        hideModal('add-event-modal');
        showNotification('Event added successfully', 'success');
        submitButton.classList.remove('loading');
    }, 500);
});

document.getElementById('edit-event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        const formData = new FormData(e.target);
        const eventId = parseInt(formData.get('event-id'));
        const eventIndex = currentEvents.findIndex(e => e.id === eventId);
        
        if (eventIndex !== -1) {
            currentEvents[eventIndex] = {
                ...currentEvents[eventIndex],
                name: formData.get('event-name'),
                club: formData.get('event-club'),
                date: formData.get('event-date'),
                capacity: formData.get('event-capacity'),
                description: formData.get('event-description')
            };
            
            updateEventsTable(currentEvents);
            hideModal('edit-event-modal');
            showNotification('Event updated successfully', 'success');
        }
        submitButton.classList.remove('loading');
    }, 500);
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 
                        type === 'error' ? 'exclamation-circle' : 
                        type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize dashboard data
function initializeDashboard() {
    // Fetch and update dashboard stats
    updateDashboardStats();
    // Fetch and update recent events
    updateRecentEvents();
    // Fetch and update recent activity
    updateRecentActivity();
    // Initialize notifications
    initializeNotifications();
}

// Update dashboard stats
function updateDashboardStats() {
    // Implement API call to fetch stats
    // For now, using static data
    const stats = {
        totalEvents: currentEvents.length,
        totalRegistrations: 156,
        totalRevenue: 45000,
        pendingApprovals: 8,
        eventsChange: 12,
        registrationsChange: 8,
        revenueChange: 15,
        approvalsChange: -3
    };
    
    // Update stats in the UI
    document.querySelector('.stat-card:nth-child(1) .stat-number').textContent = stats.totalEvents;
    document.querySelector('.stat-card:nth-child(1) .stat-change').textContent = `+${stats.eventsChange}% from last month`;
    
    document.querySelector('.stat-card:nth-child(2) .stat-number').textContent = stats.totalRegistrations;
    document.querySelector('.stat-card:nth-child(2) .stat-change').textContent = `+${stats.registrationsChange}% from last month`;
    
    document.querySelector('.stat-card:nth-child(3) .stat-number').textContent = `₹${stats.totalRevenue.toLocaleString()}`;
    document.querySelector('.stat-card:nth-child(3) .stat-change').textContent = `+${stats.revenueChange}% from last month`;
    
    document.querySelector('.stat-card:nth-child(4) .stat-number').textContent = stats.pendingApprovals;
    document.querySelector('.stat-card:nth-child(4) .stat-change').textContent = `${stats.approvalsChange} from yesterday`;
}

// Update events table
function updateEventsTable(events) {
    const tbody = document.querySelector('.events-table tbody');
    tbody.innerHTML = events.map(event => `
        <tr>
            <td>
                <div class="event-info">
                    <img src="https://via.placeholder.com/40" alt="Event">
                    <div>
                        <strong>${event.name}</strong>
                        <span>${event.club}</span>
                    </div>
                </div>
            </td>
            <td>${event.date}</td>
            <td>${event.capacity}</td>
            <td><span class="status ${event.status}">${event.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon edit-btn" title="Edit" data-event-id="${event.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon view-btn" title="View Details" data-event-id="${event.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon delete-btn" title="Delete" data-event-id="${event.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Update recent events
function updateRecentEvents() {
    // Implement API call to fetch recent events
    // For now, using static data
    currentEvents = [
        {
            id: 1,
            name: 'Tech Workshop',
            club: 'Technical Club',
            date: 'Mar 15, 2024',
            capacity: '45/50',
            status: 'active',
            description: 'A hands-on workshop on the latest technologies.'
        },
        {
            id: 2,
            name: 'Cultural Festival',
            club: 'Cultural Club',
            date: 'Mar 20, 2024',
            capacity: '120/150',
            status: 'upcoming',
            description: 'Annual cultural festival showcasing various performances.'
        }
    ];
    
    updateEventsTable(currentEvents);
}

// Update recent activity
function updateRecentActivity() {
    // Implement API call to fetch recent activity
    // For now, using static data
    const activities = [
        {
            icon: 'user-plus',
            text: '<strong>John Doe</strong> registered for <strong>Tech Workshop</strong>',
            time: '2 minutes ago'
        },
        {
            icon: 'money-bill-wave',
            text: 'Payment received for <strong>Cultural Festival</strong>',
            time: '15 minutes ago'
        },
        {
            icon: 'calendar-plus',
            text: 'New event <strong>Business Summit</strong> created',
            time: '1 hour ago'
        },
        {
            icon: 'user-check',
            text: '5 registrations approved for <strong>Tech Workshop</strong>',
            time: '2 hours ago'
        }
    ];
    
    // Update activity list
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.text}</p>
                <span>${activity.time}</span>
            </div>
        </div>
    `).join('');
}

// Initialize notifications
function initializeNotifications() {
    // Check for new notifications
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        // Implement notification check logic
        notificationBadge.textContent = '3';
    }
}

// Logout functionality
document.querySelector('.admin-nav .logout a').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Clear admin session
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    
    // Redirect to login page
    window.location.href = 'index.html';
});

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', initializeDashboard); 