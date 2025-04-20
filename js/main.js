// Sample events data (in a real application, this would come from a backend)
const events = [
    {
        id: 1,
        title: "Web Development Workshop",
        date: "2025-03-15",
        time: "10:00 AM",
        category: "technical",
        description: "Learn the basics of web development with HTML, CSS, and JavaScript.",
        price: "₹500",
        location: "Room 101, Computer Science Department"
    },
    {
        id: 2,
        title: "Cultural Night",
        date: "2025-03-20",
        time: "6:00 PM",
        category: "cultural",
        description: "A night of music, dance, and cultural performances.",
        price: "₹300",
        location: "College Auditorium"
    },
    {
        id: 3,
        title: "Business Pitch Competition",
        date: "2025-03-25",
        time: "2:00 PM",
        category: "business",
        description: "Present your business ideas to industry experts.",
        price: "₹1000",
        location: "Business School Auditorium"
    }
];

// DOM Elements
const studentBtn = document.getElementById('student-btn');
const adminBtn = document.getElementById('faculty-admin-btn');
const studentModal = document.getElementById('student-modal');
const adminModal = document.getElementById('admin-modal');
const eventSearch = document.getElementById('event-search');
const eventCategoryFilter = document.getElementById('event-category-filter');
const eventsGrid = document.getElementById('events-grid');
const eventSelect = document.getElementById('event-select');
const studentRegistrationForm = document.getElementById('student-registration-form');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    displayEvents();
    populateEventSelect();
});

studentBtn.addEventListener('click', () => showModal('student-modal'));
adminBtn.addEventListener('click', () => showModal('admin-modal'));

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Event Display Functions
function displayEvents() {
    const filteredEvents = filterEvents();
    eventsGrid.innerHTML = filteredEvents.map(event => `
        <div class="event-card">
            <h3>${event.title}</h3>
            <p class="event-date">${formatDate(event.date)} at ${event.time}</p>
            <p class="event-location">${event.location}</p>
            <p class="event-description">${event.description}</p>
            <p class="event-price">Price: ${event.price}</p>
            <button class="btn btn-primary" onclick="registerForEvent(${event.id})">Register</button>
        </div>
    `).join('');
}

function populateEventSelect() {
    eventSelect.innerHTML = events.map(event => `
        <option value="${event.id}">${event.title} - ${formatDate(event.date)}</option>
    `).join('');
}

// Filter Functions
function filterEvents() {
    const searchTerm = eventSearch.value.toLowerCase();
    const category = eventCategoryFilter.value;

    return events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                            event.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || event.category === category;
        return matchesSearch && matchesCategory;
    });
}

// Search and Filter Event Listeners
eventSearch.addEventListener('input', displayEvents);
eventCategoryFilter.addEventListener('change', displayEvents);

// Form Submission
studentRegistrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(studentRegistrationForm);
    const registrationData = {
        name: formData.get('name'),
        studentId: formData.get('student-id'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        eventId: formData.get('event'),
        paymentMode: formData.get('payment-mode')
    };

    // In a real application, this would send data to a backend
    console.log('Registration Data:', registrationData);
    alert('Registration successful!');
    hideModal('student-modal');
    studentRegistrationForm.reset();
});

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function registerForEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        eventSelect.value = eventId;
        showModal('student-modal');
    }
}

// Admin Login Form
document.getElementById('admin-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    // In a real application, this would validate credentials with a backend
    if (email === 'admin@example.com' && password === 'admin123') {
        alert('Login successful!');
        hideModal('admin-modal');
        // Redirect to admin dashboard
        window.location.href = 'admin-dashboard.html';
    } else {
        alert('Invalid credentials!');
    }
}); 