// Event Data
const events = [
    {
        id: 1,
        name: 'Web Development Masterclass',
        date: '15 May 2024',
        time: '10:00 AM - 4:00 PM',
        location: 'Auditorium A',
        seats: 120,
        description: 'Learn modern web development with React, Node.js, and more',
        capacity: 150
    },
    {
        id: 2,
        name: 'Cloud Computing with AWS',
        date: '20 May 2024',
        time: '2:00 PM - 6:00 PM',
        location: 'Lab Block - Room 301',
        seats: 80,
        description: 'Deep dive into AWS services and cloud architecture',
        capacity: 100
    },
    {
        id: 3,
        name: 'AI/ML Workshop',
        date: '25 May 2024',
        time: '9:00 AM - 1:00 PM',
        location: 'Computer Lab B',
        seats: 45,
        description: 'Introduction to Machine Learning and AI fundamentals',
        capacity: 60
    },
    {
        id: 4,
        name: 'Cybersecurity Seminar',
        date: '28 May 2024',
        time: '3:00 PM - 5:30 PM',
        location: 'Seminar Hall',
        seats: 200,
        description: 'Latest trends and best practices in cybersecurity',
        capacity: 250
    },
    {
        id: 5,
        name: 'Data Science Bootcamp',
        date: '01 June 2024',
        time: '10:00 AM - 3:00 PM',
        location: 'Innovation Center',
        seats: 60,
        description: 'Master data analysis and visualization techniques',
        capacity: 80
    },
    {
        id: 6,
        name: 'Mobile App Development',
        date: '05 June 2024',
        time: '2:00 PM - 6:00 PM',
        location: 'Lab Block - Room 202',
        seats: 90,
        description: 'Build native and cross-platform mobile applications',
        capacity: 120
    }
];

// Registration storage
let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
let selectedEvent = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeEvents();
    setupFormListeners();
    setupNavigation();
    loadEventOptions();
});

// Initialize Events Display
function initializeEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = '';

    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
    });
}

// Create Event Card
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const seatsRemaining = event.capacity - event.seats;
    const seatsLimitedClass = seatsRemaining < 20 ? 'limited' : '';

    card.innerHTML = `
        <div class="event-card-header">
            <h3>${event.name}</h3>
        </div>
        <div class="event-card-body">
            <div class="event-detail">
                <span class="event-detail-icon">📅</span>
                <div class="event-detail-text">
                    <div class="event-detail-label">Date</div>
                    <div class="event-detail-value">${event.date}</div>
                </div>
            </div>
            <div class="event-detail">
                <span class="event-detail-icon">🕐</span>
                <div class="event-detail-text">
                    <div class="event-detail-label">Time</div>
                    <div class="event-detail-value">${event.time}</div>
                </div>
            </div>
            <div class="event-detail">
                <span class="event-detail-icon">📍</span>
                <div class="event-detail-text">
                    <div class="event-detail-label">Location</div>
                    <div class="event-detail-value">${event.location}</div>
                </div>
            </div>
            <div class="event-detail">
                <span class="event-detail-icon">ℹ️</span>
                <div class="event-detail-text">
                    <div class="event-detail-label">Description</div>
                    <div class="event-detail-value">${event.description}</div>
                </div>
            </div>
        </div>
        <div class="event-card-footer">
            <div class="event-seats ${seatsLimitedClass}">
                ${seatsRemaining} seats remaining
            </div>
            <button class="btn btn-primary" onclick="selectEventAndScroll(${event.id})">
                Register for Event
            </button>
        </div>
    `;

    return card;
}

// Select event and scroll to form
function selectEventAndScroll(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        document.getElementById('eventSelect').value = eventId;
        selectedEvent = event;
        updateSummary();
        document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
    }
}

// Load event options in select dropdown
function loadEventOptions() {
    const eventSelect = document.getElementById('eventSelect');
    
    events.forEach(event => {
        const option = document.createElement('option');
        option.value = event.id;
        option.textContent = event.name;
        eventSelect.appendChild(option);
    });

    eventSelect.addEventListener('change', function() {
        if (this.value) {
            selectedEvent = events.find(e => e.id === parseInt(this.value));
            updateSummary();
        } else {
            selectedEvent = null;
            updateSummary();
        }
    });
}

// Update summary card
function updateSummary() {
    const summaryContent = document.getElementById('summaryContent');

    if (!selectedEvent) {
        summaryContent.innerHTML = '<p>Select an event to see details</p>';
        return;
    }

    const seatsRemaining = selectedEvent.capacity - selectedEvent.seats;
    const summaryHTML = `
        <div class="summary-item">
            <div class="summary-item-label">Event</div>
            <div class="summary-item-value">${selectedEvent.name}</div>
        </div>
        <div class="summary-item">
            <div class="summary-item-label">Date & Time</div>
            <div class="summary-item-value">${selectedEvent.date}, ${selectedEvent.time}</div>
        </div>
        <div class="summary-item">
            <div class="summary-item-label">Location</div>
            <div class="summary-item-value">${selectedEvent.location}</div>
        </div>
        <div class="summary-item">
            <div class="summary-item-label">Seats Available</div>
            <div class="summary-item-value ${seatsRemaining < 20 ? 'limited' : ''}">${seatsRemaining} / ${selectedEvent.capacity}</div>
        </div>
        <div class="summary-item">
            <div class="summary-item-label">Status</div>
            <div class="summary-item-value">${seatsRemaining > 0 ? '✓ Open' : '✗ Full'}</div>
        </div>
    `;

    summaryContent.innerHTML = summaryHTML;
}

// Setup form listeners
function setupFormListeners() {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!selectedEvent) {
            showNotification('Please select an event first', 'error');
            return;
        }

        const seatsRemaining = selectedEvent.capacity - selectedEvent.seats;
        if (seatsRemaining <= 0) {
            showNotification('Sorry, no seats available for this event', 'error');
            return;
        }

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Collect form data
        const formData = {
            id: Date.now(),
            event: selectedEvent.name,
            eventId: selectedEvent.id,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            rollNo: document.getElementById('rollNo').value,
            department: document.getElementById('department').value,
            semester: document.getElementById('semester').value,
            message: document.getElementById('message').value,
            date: new Date().toLocaleString()
        };

        // Save registration
        registrations.push(formData);
        localStorage.setItem('registrations', JSON.stringify(registrations));

        // Update event seats
        selectedEvent.seats++;

        // Show success modal
        showSuccessModal(formData);

        // Reset form
        form.reset();
        selectedEvent = null;
        updateSummary();
        document.getElementById('eventSelect').value = '';
    });
}

// Validate form
function validateForm() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const rollNo = document.getElementById('rollNo').value;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9\+\-\s]{10,}$/;
    if (!phoneRegex.test(phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return false;
    }

    // Roll number validation
    if (rollNo.trim() === '') {
        showNotification('Please enter a valid roll number', 'error');
        return false;
    }

    return true;
}

// Show success modal
function showSuccessModal(formData) {
    const modal = document.getElementById('successModal');
    const confirmationDetails = document.getElementById('confirmationDetails');
    const confirmationEmail = document.getElementById('confirmationEmail');

    confirmationDetails.innerHTML = `
        <strong>Registration Confirmation:</strong><br>
        Event: ${formData.event}<br>
        Name: ${formData.firstName} ${formData.lastName}<br>
        Roll No: ${formData.rollNo}<br>
        Department: ${formData.department}
    `;

    confirmationEmail.textContent = formData.email;

    modal.style.display = 'block';
    showNotification('Registration successful! Check your email for confirmation.', 'success');
}

// Close modal
function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Show notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Setup navigation
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar-container')) {
            navMenu.classList.remove('active');
        }
    });
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Export registrations (for admin purposes)
function exportRegistrations() {
    const dataStr = JSON.stringify(registrations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'registrations.json';
    link.click();
}

// Get registration count for an event
function getEventRegistrationCount(eventId) {
    return registrations.filter(r => r.eventId === eventId).length;
}

// Admin Panel Functions
let adminLoggedIn = false;

// Open admin login modal
function openAdminLogin(event) {
    event.preventDefault();
    document.getElementById('adminLoginModal').style.display = 'block';
}

// Close admin login modal
function closeAdminLogin() {
    document.getElementById('adminLoginModal').style.display = 'none';
}

// Handle admin login
function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Simple authentication (demo purposes)
    if (username === 'admin' && password === 'password') {
        adminLoggedIn = true;
        sessionStorage.setItem('adminLoggedIn', 'true');
        closeAdminLogin();
        openAdminPanel();
        showNotification('Admin login successful!', 'success');
        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';
    } else {
        showNotification('Invalid credentials. Use admin/password', 'error');
    }
}

// Open admin panel
function openAdminPanel() {
    if (!adminLoggedIn && !sessionStorage.getItem('adminLoggedIn')) {
        openAdminLogin();
        return;
    }
    
    adminLoggedIn = true;
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.classList.remove('hidden');
    loadAdminData();
}

// Close admin panel
function closeAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.classList.add('hidden');
    adminLoggedIn = false;
    sessionStorage.removeItem('adminLoggedIn');
}

// Switch between admin tabs
function switchAdminTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from buttons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    // Load data based on tab
    if (tabName === 'registrations') {
        loadRegistrationsTable();
    } else if (tabName === 'analytics') {
        loadAnalytics();
    } else if (tabName === 'events') {
        loadAdminEventsList();
    }
}

// Load admin data
function loadAdminData() {
    loadAdminEventsList();
    loadRegistrationsTable();
    loadAnalytics();
}

// Load admin events list
function loadAdminEventsList() {
    const adminEventsList = document.getElementById('adminEventsList');
    adminEventsList.innerHTML = '';
    
    events.forEach(event => {
        const regCount = getEventRegistrationCount(event.id);
        const eventDiv = document.createElement('div');
        eventDiv.className = 'admin-event-item';
        eventDiv.innerHTML = `
            <div class="event-info">
                <h5>${event.name}</h5>
                <p>${event.date} | ${event.time}</p>
                <p>Location: ${event.location}</p>
                <p>Capacity: ${event.capacity} | Registered: ${regCount} | Available: ${event.capacity - regCount}</p>
            </div>
            <div class="event-actions">
                <button class="btn btn-secondary btn-small" onclick="editEvent(${event.id})">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteEvent(${event.id})">Delete</button>
            </div>
        `;
        adminEventsList.appendChild(eventDiv);
    });
}

// Add new event
function addNewEvent() {
    const name = document.getElementById('adminEventName').value;
    const date = document.getElementById('adminEventDate').value;
    const time = document.getElementById('adminEventTime').value;
    const location = document.getElementById('adminEventLocation').value;
    const capacity = parseInt(document.getElementById('adminEventCapacity').value);
    const description = document.getElementById('adminEventDescription').value;
    
    if (!name || !date || !time || !location || !capacity || !description) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const newEvent = {
        id: Date.now(),
        name: name,
        date: date,
        time: time,
        location: location,
        seats: 0,
        description: description,
        capacity: capacity
    };
    
    events.push(newEvent);
    
    // Clear form
    document.getElementById('adminEventName').value = '';
    document.getElementById('adminEventDate').value = '';
    document.getElementById('adminEventTime').value = '';
    document.getElementById('adminEventLocation').value = '';
    document.getElementById('adminEventCapacity').value = '';
    document.getElementById('adminEventDescription').value = '';
    
    // Update event dropdown in main form
    const eventSelect = document.getElementById('eventSelect');
    const option = document.createElement('option');
    option.value = newEvent.id;
    option.textContent = newEvent.name;
    eventSelect.appendChild(option);
    
    // Reinitialize events display
    initializeEvents();
    loadAdminEventsList();
    
    showNotification('Event added successfully!', 'success');
}

// Delete event
function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        const index = events.findIndex(e => e.id === eventId);
        if (index > -1) {
            events.splice(index, 1);
            
            // Remove from select dropdown
            const eventSelect = document.getElementById('eventSelect');
            const option = eventSelect.querySelector(`option[value="${eventId}"]`);
            if (option) option.remove();
            
            // Reinitialize events display
            initializeEvents();
            loadAdminEventsList();
            
            showNotification('Event deleted successfully!', 'success');
        }
    }
}

// Edit event (placeholder - can be enhanced)
function editEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        document.getElementById('adminEventName').value = event.name;
        document.getElementById('adminEventDate').value = event.date;
        document.getElementById('adminEventTime').value = event.time;
        document.getElementById('adminEventLocation').value = event.location;
        document.getElementById('adminEventCapacity').value = event.capacity;
        document.getElementById('adminEventDescription').value = event.description;
        
        showNotification('Edit the event details and add again to update', 'warning');
    }
}

// Load registrations table
function loadRegistrationsTable() {
    const registrationsList = document.getElementById('registrationsList');
    
    if (registrations.length === 0) {
        registrationsList.innerHTML = '<p style="text-align: center; padding: 2rem;">No registrations yet</p>';
        return;
    }
    
    let html = `
        <table class="registrations-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Roll No</th>
                    <th>Department</th>
                    <th>Event</th>
                    <th>Phone</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    registrations.forEach(reg => {
        html += `
            <tr>
                <td>${reg.firstName} ${reg.lastName}</td>
                <td>${reg.email}</td>
                <td>${reg.rollNo}</td>
                <td>${reg.department}</td>
                <td>${reg.event}</td>
                <td>${reg.phone}</td>
                <td>${reg.date}</td>
                <td><button class="btn btn-danger btn-small" onclick="deleteRegistration(${reg.id})">Delete</button></td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    registrationsList.innerHTML = html;
}

// Delete registration
function deleteRegistration(regId) {
    if (confirm('Are you sure you want to delete this registration?')) {
        const index = registrations.findIndex(r => r.id === regId);
        if (index > -1) {
            const reg = registrations[index];
            registrations.splice(index, 1);
            localStorage.setItem('registrations', JSON.stringify(registrations));
            
            // Update event seats
            const event = events.find(e => e.id === reg.eventId);
            if (event && event.seats > 0) {
                event.seats--;
            }
            
            loadRegistrationsTable();
            showNotification('Registration deleted successfully!', 'success');
        }
    }
}

// Filter registrations
function filterRegistrations() {
    const filter = document.getElementById('registrationFilter').value.toLowerCase();
    const rows = document.querySelectorAll('.registrations-table tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
}

// Export registrations as CSV
function exportRegistrationsCSV() {
    let csv = 'Name,Email,Roll Number,Department,Event,Phone,Registration Date\n';
    
    registrations.forEach(reg => {
        csv += `"${reg.firstName} ${reg.lastName}","${reg.email}","${reg.rollNo}","${reg.department}","${reg.event}","${reg.phone}","${reg.date}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'registrations.csv';
    link.click();
}

// Load analytics
function loadAnalytics() {
    // Total events
    document.getElementById('totalEventsCount').textContent = events.length;
    
    // Total registrations
    document.getElementById('totalRegistrationsCount').textContent = registrations.length;
    
    // Total capacity
    const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
    document.getElementById('totalCapacityCount').textContent = totalCapacity;
    
    // Seats filled percentage
    const totalSeats = events.reduce((sum, e) => sum + e.seats, 0);
    const percentage = totalCapacity > 0 ? Math.round((totalSeats / totalCapacity) * 100) : 0;
    document.getElementById('seatsFilled').textContent = percentage + '%';
    
    // Event-wise stats
    const eventStatsDiv = document.getElementById('eventStats');
    eventStatsDiv.innerHTML = '';
    
    events.forEach(event => {
        const regCount = getEventRegistrationCount(event.id);
        const percentage = Math.round((regCount / event.capacity) * 100);
        
        const statDiv = document.createElement('div');
        statDiv.className = 'event-stat-row';
        statDiv.innerHTML = `
            <div class="event-stat-name">${event.name}</div>
            <div class="event-stat-bar">
                <div class="event-stat-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="event-stat-numbers">${regCount}/${event.capacity} (${percentage}%)</div>
        `;
        eventStatsDiv.appendChild(statDiv);
    });
}

// Console logging for debugging (optional)
console.log('Event Registration System Loaded');
console.log(`Total Events: ${events.length}`);
console.log(`Total Registrations: ${registrations.length}`);
