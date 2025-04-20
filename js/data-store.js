// Centralized Data Store
const DataStore = {
    // Initialize data store
    init() {
        // Load data from localStorage or initialize with default values
        this.events = JSON.parse(localStorage.getItem('events') || '[]');
        this.registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        this.expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
        this.income = JSON.parse(localStorage.getItem('income') || '[]');
        this.settings = JSON.parse(localStorage.getItem('settings') || '{}');
        
        // Set up event listeners for data changes
        this.setupEventListeners();
    },

    // Set up event listeners for data changes
    setupEventListeners() {
        // Listen for storage events from other tabs/windows
        window.addEventListener('storage', (e) => {
            if (e.key === 'events') {
                this.events = JSON.parse(e.newValue || '[]');
                this.notifyListeners('events');
            } else if (e.key === 'registrations') {
                this.registrations = JSON.parse(e.newValue || '[]');
                this.notifyListeners('registrations');
            } else if (e.key === 'expenses') {
                this.expenses = JSON.parse(e.newValue || '[]');
                this.notifyListeners('expenses');
            } else if (e.key === 'income') {
                this.income = JSON.parse(e.newValue || '[]');
                this.notifyListeners('income');
            } else if (e.key === 'settings') {
                this.settings = JSON.parse(e.newValue || '{}');
                this.notifyListeners('settings');
            }
        });
    },

    // Event listeners for data changes
    listeners: {
        events: [],
        registrations: [],
        expenses: [],
        income: [],
        settings: []
    },

    // Add event listener for data changes
    addListener(type, callback) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
    },

    // Remove event listener
    removeListener(type, callback) {
        if (this.listeners[type]) {
            this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
        }
    },

    // Notify all listeners of data changes
    notifyListeners(type) {
        if (this.listeners[type]) {
            this.listeners[type].forEach(callback => callback(this[type]));
        }
    },

    // Event Management
    addEvent(event) {
        this.events.push(event);
        this.saveEvents();
    },

    updateEvent(eventId, updates) {
        const index = this.events.findIndex(e => e._id === eventId);
        if (index !== -1) {
            this.events[index] = { ...this.events[index], ...updates };
            this.saveEvents();
        }
    },

    deleteEvent(eventId) {
        this.events = this.events.filter(e => e._id !== eventId);
        this.saveEvents();
    },

    // Registration Management
    addRegistration(registration) {
        this.registrations.push(registration);
        this.saveRegistrations();
    },

    updateRegistration(registrationId, updates) {
        const index = this.registrations.findIndex(r => r._id === registrationId);
        if (index !== -1) {
            this.registrations[index] = { ...this.registrations[index], ...updates };
            this.saveRegistrations();
        }
    },

    deleteRegistration(registrationId) {
        this.registrations = this.registrations.filter(r => r._id !== registrationId);
        this.saveRegistrations();
    },

    // Expense Management
    addExpense(expense) {
        this.expenses.push(expense);
        this.saveExpenses();
    },

    updateExpense(expenseId, updates) {
        const index = this.expenses.findIndex(e => e._id === expenseId);
        if (index !== -1) {
            this.expenses[index] = { ...this.expenses[index], ...updates };
            this.saveExpenses();
        }
    },

    deleteExpense(expenseId) {
        this.expenses = this.expenses.filter(e => e._id !== expenseId);
        this.saveExpenses();
    },

    // Income Management
    addIncome(income) {
        this.income.push(income);
        this.saveIncome();
    },

    getEventIncome(eventId) {
        return this.income.filter(i => i.eventId === eventId);
    },

    calculateEventIncome(eventId) {
        const eventIncome = this.getEventIncome(eventId);
        return eventIncome.reduce((sum, i) => sum + i.amount, 0);
    },

    getEventIncomeStats(eventId) {
        const event = this.events.find(e => e._id === eventId);
        if (!event) return null;

        const registrations = this.getEventParticipants(eventId);
        const completedPayments = registrations.filter(r => r.paymentStatus === 'completed').length;
        const pendingPayments = registrations.filter(r => r.paymentStatus === 'pending').length;
        const totalIncome = this.calculateEventIncome(eventId);
        const potentialIncome = parseInt(event.capacity.split('/')[1]) * event.entryFee;
        const collectionPercentage = potentialIncome > 0 ? (totalIncome / potentialIncome) * 100 : 0;

        return {
            totalIncome,
            completedPayments,
            pendingPayments,
            collectionPercentage
        };
    },

    saveIncome() {
        localStorage.setItem('income', JSON.stringify(this.income));
        this.notifyListeners('income');
    },

    // Settings Management
    updateSettings(updates) {
        this.settings = { ...this.settings, ...updates };
        this.saveSettings();
    },

    // Save methods
    saveEvents() {
        localStorage.setItem('events', JSON.stringify(this.events));
        this.notifyListeners('events');
    },

    saveRegistrations() {
        localStorage.setItem('registrations', JSON.stringify(this.registrations));
        this.notifyListeners('registrations');
    },

    saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(this.expenses));
        this.notifyListeners('expenses');
    },

    saveSettings() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
        this.notifyListeners('settings');
    },

    // Helper methods
    getEventById(eventId) {
        return this.events.find(e => e._id === eventId);
    },

    getRegistrationsByEventId(eventId) {
        return this.registrations.filter(r => r.eventId === eventId);
    },

    getExpensesByEventId(eventId) {
        return this.expenses.filter(e => e.eventId === eventId);
    },

    // Calculate statistics
    calculateEventStats(eventId) {
        const event = this.getEventById(eventId);
        if (!event) return null;

        const registrations = this.getRegistrationsByEventId(eventId);
        const expenses = this.getExpensesByEventId(eventId);

        const confirmedParticipants = registrations.filter(r => r.status === 'confirmed').length;
        const totalCapacity = parseInt(event.capacity.split('/')[1]);
        const moneyCollected = registrations
            .filter(r => r.status === 'confirmed' && r.paymentStatus === 'completed')
            .reduce((sum, r) => sum + r.amount, 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

        return {
            confirmedParticipants,
            totalCapacity,
            moneyCollected,
            totalExpenses,
            collectionPercentage: (moneyCollected / (totalCapacity * event.entryFee)) * 100,
            budgetStatus: event.budget - totalExpenses
        };
    },

    // Participant Management
    addParticipant(participant) {
        // Check if participant already exists
        const exists = this.registrations.some(r => 
            r.student.studentId === participant.student.studentId && 
            r.eventId === participant.eventId
        );

        if (!exists) {
            this.registrations.push(participant);
            this.saveRegistrations();
            return true;
        }
        return false;
    },

    // Check for new registrations from index.html
    checkNewRegistrations() {
        // Get new registrations from localStorage
        const newRegistrations = JSON.parse(localStorage.getItem('newRegistrations') || '[]');
        
        if (newRegistrations.length > 0) {
            let addedCount = 0;
            newRegistrations.forEach(registration => {
                if (this.addParticipant(registration)) {
                    addedCount++;
                    
                    // Add income record for the registration
                    this.addIncome({
                        _id: `I${Date.now()}`,
                        eventId: registration.eventId,
                        amount: registration.amount,
                        type: 'registration',
                        date: new Date().toISOString(),
                        reference: registration.paymentReference,
                        status: registration.paymentStatus
                    });
                }
            });
            
            // Clear new registrations from localStorage
            localStorage.removeItem('newRegistrations');
            
            if (addedCount > 0) {
                this.notifyListeners('registrations');
                this.notifyListeners('income');
                return addedCount;
            }
        }
        return 0;
    },

    // Get all participants for an event
    getEventParticipants(eventId) {
        return this.registrations.filter(r => r.eventId === eventId);
    },

    // Get participant by ID
    getParticipantById(participantId) {
        return this.registrations.find(r => r._id === participantId);
    },

    // Update participant status
    updateParticipantStatus(participantId, status) {
        const registration = this.getParticipantById(participantId);
        if (registration) {
            registration.status = status;
            this.saveRegistrations();
            return true;
        }
        return false;
    },

    // Update participant payment status
    updateParticipantPayment(participantId, paymentStatus, paymentMethod, paymentReference) {
        const registration = this.getParticipantById(participantId);
        if (registration) {
            registration.paymentStatus = paymentStatus;
            registration.paymentMethod = paymentMethod;
            registration.paymentReference = paymentReference;
            this.saveRegistrations();
            return true;
        }
        return false;
    },

    // Remove participant
    removeParticipant(participantId) {
        const index = this.registrations.findIndex(r => r._id === participantId);
        if (index !== -1) {
            this.registrations.splice(index, 1);
            this.saveRegistrations();
            return true;
        }
        return false;
    },

    // Initialize periodic check for new registrations
    initRegistrationCheck() {
        // Check immediately
        this.checkNewRegistrations();
        
        // Set up periodic check
        setInterval(() => {
            const addedCount = this.checkNewRegistrations();
            if (addedCount > 0) {
                console.log(`Added ${addedCount} new registration(s)`);
            }
        }, 5000); // Check every 5 seconds
    }
};

// Initialize data store and start registration check
DataStore.init();
DataStore.initRegistrationCheck(); 