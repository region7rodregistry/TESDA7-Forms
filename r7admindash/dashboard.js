// R7 Admin Dashboard JavaScript
// This file contains all the dashboard functionality separated from the HTML

// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyBknxUstLA8F4YkkNT9rVCoEgTzJBSu24A",
    authDomain: "r7nttconaf.firebaseapp.com",
    projectId: "r7nttconaf",
    storageBucket: "r7nttcmis.firebasestorage.app",
    messagingSenderId: "521822609098",
    appId: "1:521822609098:web:e8ee10f63098924bb35e33",
    measurementId: "G-0VPXC641LT"
};

// Global variables
let allApplications = {};
let filteredApplications = [];
let currentPage = 1;
const itemsPerPage = 20;
let currentFilters = {
    search: '',
    province: '',
    status: '',
    account: '',
    date: ''
};

// Dashboard class to organize functionality
class R7AdminDashboard {
    constructor() {
        this.db = null;
        this.auth = null;
        this.applicationsCol = null;
        this.initializeFirebase();
        this.setupEventListeners();
    }

    // Initialize Firebase
    async initializeFirebase() {
        try {
            const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
            const { getFirestore, collection } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            const { getAuth, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");

            const app = initializeApp(firebaseConfig);
            this.db = getFirestore(app);
            this.auth = getAuth(app);
            this.applicationsCol = collection(this.db, 'applications');

            // Check authentication
            onAuthStateChanged(this.auth, (user) => {
                if (!user) {
                    window.location.href = "../login.html";
                    return;
                }
                
                // Update user info
                this.updateUserInfo(user);
                
                // Load data
                this.loadApplications();
            });

        } catch (error) {
            console.error('Error initializing Firebase:', error);
            this.showError('Error initializing Firebase. Please refresh the page.');
        }
    }

    // Update user information display
    updateUserInfo(user) {
        const userEmailElement = document.getElementById('userEmail');
        const userProvinceElement = document.getElementById('userProvince');
        
        if (userEmailElement) {
            userEmailElement.textContent = user.email;
        }
        
        if (userProvinceElement) {
            // Determine user's province access
            const userProvinceMap = {
                'r7po.registry@gmail.com': 'Cebu',
                'r7po46.registry@gmail.com': 'Negros Oriental',
                'r7po12.registry@gmail.com': 'Bohol',
                'r7po61.registry@gmail.com': 'Siquijor',
                'region7@tesda.gov.ph': 'All Provinces'
            };
            
            const province = userProvinceMap[user.email] || 'All Provinces';
            userProvinceElement.textContent = province;
        }
    }

    // Setup all event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.handleSearch());
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }
        
        // Filter changes
        const provinceFilter = document.getElementById('provinceFilter');
        const statusFilter = document.getElementById('statusFilter');
        const accountFilter = document.getElementById('accountFilter');
        const dateFilter = document.getElementById('dateFilter');
        
        if (provinceFilter) {
            provinceFilter.addEventListener('change', () => this.handleFilterChange());
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.handleFilterChange());
        }
        
        if (accountFilter) {
            accountFilter.addEventListener('change', () => this.handleFilterChange());
        }
        
        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.handleFilterChange());
        }
        
        // Clear filters
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => this.clearAllFilters());
        }
        
        // Export data
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToCSV());
        }
        
        // Summary card clicks
        document.querySelectorAll('.summary-card').forEach(card => {
            card.addEventListener('click', () => {
                const province = card.dataset.province;
                this.handleProvinceCardClick(province);
            });
        });

        // Province filter card clicks
        document.querySelectorAll('.province-filter-card').forEach(card => {
            card.addEventListener('click', () => {
                const province = card.dataset.province;
                this.handleProvinceFilterCardClick(province);
            });
        });
        
        // Pagination
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.changePage(-1));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.changePage(1));
        }
    }

    // Load applications from Firebase
    async loadApplications() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'flex';
        }
        
        try {
            const { onSnapshot } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
            
            onSnapshot(this.applicationsCol, (snapshot) => {
                const data = {};
                snapshot.forEach(docSnap => {
                    data[docSnap.id] = docSnap.data();
                });
                
                allApplications = data;
                this.updateSummaryCards(data);
                this.applyFilters();
                
                if (loadingSpinner) {
                    loadingSpinner.style.display = 'none';
                }
            }, (error) => {
                console.error('Error loading applications:', error);
                if (loadingSpinner) {
                    loadingSpinner.style.display = 'none';
                }
                this.showError('Error loading applications. Please try again.');
            });
            
        } catch (error) {
            console.error('Error setting up Firebase listener:', error);
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
            this.showError('Error setting up data connection. Please refresh the page.');
        }
    }

    // Update summary cards with data
    updateSummaryCards(applications) {
        const provinces = ['Cebu', 'Bohol', 'Negros-Oriental', 'Siquijor'];
        
        provinces.forEach(province => {
            const provinceKey = province.toLowerCase().replace('-', '');
            const provinceData = Object.values(applications).filter(app => 
                app.manpowerProfile?.province === province
            );
            
            const total = provinceData.length;
            const pending = provinceData.filter(app => app.status === 'pending').length;
            const completed = provinceData.filter(app => app.status === 'completed').length;
            
            const totalElement = document.getElementById(`${provinceKey}-total`);
            const pendingElement = document.getElementById(`${provinceKey}-pending`);
            const completedElement = document.getElementById(`${provinceKey}-completed`);
            
            if (totalElement) totalElement.textContent = total;
            if (pendingElement) pendingElement.textContent = pending;
            if (completedElement) completedElement.textContent = completed;
        });

        // Update province filter cards
        this.updateProvinceFilterCards(applications);
    }

    // Update province filter cards with data
    updateProvinceFilterCards(applications) {
        const provinces = ['Cebu', 'Bohol', 'Negros-Oriental', 'Siquijor'];
        
        // Update "ALL" card
        const allTotal = Object.keys(applications).length;
        const allTotalElement = document.getElementById('all-total');
        if (allTotalElement) allTotalElement.textContent = allTotal;
        
        // Update individual province cards
        provinces.forEach(province => {
            const provinceKey = province.toLowerCase().replace('-', '');
            const provinceData = Object.values(applications).filter(app => 
                app.manpowerProfile?.province === province
            );
            
            const total = provinceData.length;
            const filterTotalElement = document.getElementById(`${provinceKey}-filter-total`);
            if (filterTotalElement) filterTotalElement.textContent = total;
        });
    }

    // Handle search input
    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            currentFilters.search = searchInput.value;
            this.applyFilters();
        }
    }

    // Handle filter changes
    handleFilterChange() {
        const provinceFilter = document.getElementById('provinceFilter');
        const statusFilter = document.getElementById('statusFilter');
        const accountFilter = document.getElementById('accountFilter');
        const dateFilter = document.getElementById('dateFilter');
        
        if (provinceFilter) currentFilters.province = provinceFilter.value;
        if (statusFilter) currentFilters.status = statusFilter.value;
        if (accountFilter) currentFilters.account = accountFilter.value;
        if (dateFilter) currentFilters.date = dateFilter.value;
        
        // Update province filter cards to reflect the current filter
        this.updateProvinceFilterCardStates();
        
        this.applyFilters();
    }

    // Update province filter card states based on current filter
    updateProvinceFilterCardStates() {
        // Remove active class from all cards
        document.querySelectorAll('.province-filter-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active class to the appropriate card
        if (currentFilters.province === '') {
            const allCard = document.querySelector('[data-province="ALL"]');
            if (allCard) allCard.classList.add('active');
        } else {
            const provinceCard = document.querySelector(`[data-province="${currentFilters.province}"]`);
            if (provinceCard) provinceCard.classList.add('active');
        }
    }

    // Apply all filters to the data
    applyFilters() {
        filteredApplications = Object.entries(allApplications).filter(([key, app]) => {
            // Search filter
            if (currentFilters.search) {
                const searchTerm = currentFilters.search.toLowerCase();
                const firstName = app.manpowerProfile?.firstName || '';
                const lastName = app.manpowerProfile?.lastName || '';
                const fullName = `${firstName} ${lastName}`.toLowerCase();
                const ticketNumber = (app.ticketNumber || '').toLowerCase();
                const email = (app.manpowerProfile?.email || '').toLowerCase();
                
                if (!fullName.includes(searchTerm) && 
                    !ticketNumber.includes(searchTerm) && 
                    !email.includes(searchTerm)) {
                    return false;
                }
            }
            
            // Province filter
            if (currentFilters.province && app.manpowerProfile?.province !== currentFilters.province) {
                return false;
            }
            
            // Status filter
            if (currentFilters.status && app.status !== currentFilters.status) {
                return false;
            }
            
            // Account filter (based on province mapping)
            if (currentFilters.account) {
                const userProvinceMap = {
                    'r7po.registry@gmail.com': 'Cebu',
                    'r7po46.registry@gmail.com': 'Negros-Oriental',
                    'r7po12.registry@gmail.com': 'Bohol',
                    'r7po61.registry@gmail.com': 'Siquijor',
                    'region7@tesda.gov.ph': null
                };
                
                const expectedProvince = userProvinceMap[currentFilters.account];
                if (expectedProvince && app.manpowerProfile?.province !== expectedProvince) {
                    return false;
                }
            }
            
            // Date filter
            if (currentFilters.date) {
                const appDate = app.tesdaInfo?.timestamp || app.timestamp;
                if (appDate) {
                    const appDateStr = new Date(appDate).toISOString().split('T')[0];
                    if (appDateStr !== currentFilters.date) {
                        return false;
                    }
                }
            }
            
            return true;
        });
        
        currentPage = 1;
        this.renderTable();
        this.updateTableInfo();
    }

    // Render the data table
    renderTable() {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (filteredApplications.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="no-data">
                        <div class="no-data-content">
                            <i>📭</i>
                            <p>No entries found matching your criteria</p>
                        </div>
                    </td>
                </tr>
            `;
            this.updatePagination(0);
            return;
        }
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedApplications = filteredApplications.slice(startIndex, endIndex);
        
        paginatedApplications.forEach(([key, app]) => {
            const row = this.createTableRow(app, key);
            tableBody.appendChild(row);
        });
        
        this.updatePagination(filteredApplications.length);
    }

    // Create a table row for an application
    createTableRow(app, key) {
        const row = document.createElement('tr');
        
        const firstName = app.manpowerProfile?.firstName || 'N/A';
        const lastName = app.manpowerProfile?.lastName || 'N/A';
        const fullName = `${firstName} ${lastName}`;
        const province = app.manpowerProfile?.province || 'N/A';
        const contact = app.manpowerProfile?.contact || 'N/A';
        const email = app.manpowerProfile?.email || 'N/A';
        const sector = app.nttcApplication?.sector || 'N/A';
        const qualification = app.nttcApplication?.qualification || 'N/A';
        const ticketNumber = app.ticketNumber || 'N/A';
        const status = app.status || 'pending';
        const timestamp = app.tesdaInfo?.timestamp || app.timestamp || 'N/A';
        
        const formattedDate = timestamp !== 'N/A' ? new Date(timestamp).toLocaleDateString() : 'N/A';
        
        row.innerHTML = `
            <td>${ticketNumber}</td>
            <td>${fullName}</td>
            <td><span class="province-badge ${province.toLowerCase().replace(' ', '-')}">${province}</span></td>
            <td>${contact}</td>
            <td>${email}</td>
            <td>${sector}</td>
            <td>${qualification}</td>
            <td><span class="status-badge ${status}">${status}</span></td>
            <td>${formattedDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="dashboard.viewEntry('${key}')" title="View Details">
                        <i>👁️</i>
                    </button>
                    <button class="action-btn edit" onclick="dashboard.editEntry('${key}')" title="Edit">
                        <i>✏️</i>
                    </button>
                    <button class="action-btn delete" onclick="dashboard.deleteEntry('${key}')" title="Delete">
                        <i>🗑️</i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }

    // Update table information display
    updateTableInfo() {
        const totalEntriesElement = document.getElementById('totalEntries');
        const filteredEntriesElement = document.getElementById('filteredEntries');
        
        if (totalEntriesElement) {
            totalEntriesElement.textContent = Object.keys(allApplications).length;
        }
        
        if (filteredEntriesElement) {
            filteredEntriesElement.textContent = filteredApplications.length;
        }
    }

    // Update pagination controls
    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const pageNumbers = document.getElementById('pageNumbers');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (!pageNumbers || !prevBtn || !nextBtn) return;
        
        // Update page numbers
        pageNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                this.renderTable();
            });
            pageNumbers.appendChild(pageBtn);
        }
        
        // Update button states
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    // Change page
    changePage(direction) {
        const newPage = currentPage + direction;
        if (newPage >= 1 && newPage <= Math.ceil(filteredApplications.length / itemsPerPage)) {
            currentPage = newPage;
            this.renderTable();
        }
    }

    // Handle province card click
    handleProvinceCardClick(province) {
        const provinceFilter = document.getElementById('provinceFilter');
        if (provinceFilter) {
            provinceFilter.value = province;
            currentFilters.province = province;
            this.applyFilters();
        }
    }

    // Handle province filter card click
    handleProvinceFilterCardClick(province) {
        // Remove active class from all cards
        document.querySelectorAll('.province-filter-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active class to clicked card
        const clickedCard = document.querySelector(`[data-province="${province}"]`);
        if (clickedCard) {
            clickedCard.classList.add('active');
        }
        
        // Update province filter
        const provinceFilter = document.getElementById('provinceFilter');
        if (provinceFilter) {
            if (province === 'ALL') {
                provinceFilter.value = '';
                currentFilters.province = '';
            } else {
                provinceFilter.value = province;
                currentFilters.province = province;
            }
            this.applyFilters();
        }
    }

    // Clear all filters
    clearAllFilters() {
        const searchInput = document.getElementById('searchInput');
        const provinceFilter = document.getElementById('provinceFilter');
        const statusFilter = document.getElementById('statusFilter');
        const accountFilter = document.getElementById('accountFilter');
        const dateFilter = document.getElementById('dateFilter');
        
        if (searchInput) searchInput.value = '';
        if (provinceFilter) provinceFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        if (accountFilter) accountFilter.value = '';
        if (dateFilter) dateFilter.value = '';
        
        currentFilters = {
            search: '',
            province: '',
            status: '',
            account: '',
            date: ''
        };
        
        // Reset province filter cards to show "ALL" as active
        document.querySelectorAll('.province-filter-card').forEach(card => {
            card.classList.remove('active');
        });
        const allCard = document.querySelector('[data-province="ALL"]');
        if (allCard) {
            allCard.classList.add('active');
        }
        
        this.applyFilters();
    }

    // Export data to CSV
    exportToCSV() {
        if (filteredApplications.length === 0) {
            this.showError('No data to export');
            return;
        }
        
        const headers = [
            'Ticket Number',
            'First Name',
            'Last Name',
            'Province',
            'Contact',
            'Email',
            'Sector',
            'Qualification',
            'Status',
            'Date Submitted'
        ];
        
        const csvContent = [
            headers.join(','),
            ...filteredApplications.map(([key, app]) => [
                app.ticketNumber || '',
                app.manpowerProfile?.firstName || '',
                app.manpowerProfile?.lastName || '',
                app.manpowerProfile?.province || '',
                app.manpowerProfile?.contact || '',
                app.manpowerProfile?.email || '',
                app.nttcApplication?.sector || '',
                app.nttcApplication?.qualification || '',
                app.status || '',
                app.tesdaInfo?.timestamp || app.timestamp || ''
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tesda-entries-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // View entry details
    viewEntry(key) {
        const app = allApplications[key];
        if (app) {
            this.showModal('View Entry', `
                <div class="entry-details">
                    <h4>${app.manpowerProfile?.firstName || ''} ${app.manpowerProfile?.lastName || ''}</h4>
                    <p><strong>Ticket:</strong> ${app.ticketNumber || 'N/A'}</p>
                    <p><strong>Province:</strong> ${app.manpowerProfile?.province || 'N/A'}</p>
                    <p><strong>Contact:</strong> ${app.manpowerProfile?.contact || 'N/A'}</p>
                    <p><strong>Email:</strong> ${app.manpowerProfile?.email || 'N/A'}</p>
                    <p><strong>Sector:</strong> ${app.nttcApplication?.sector || 'N/A'}</p>
                    <p><strong>Qualification:</strong> ${app.nttcApplication?.qualification || 'N/A'}</p>
                    <p><strong>Status:</strong> ${app.status || 'N/A'}</p>
                </div>
            `);
        }
    }

    // Edit entry (placeholder for future implementation)
    editEntry(key) {
        this.showModal('Edit Entry', 'Edit functionality will be implemented here.');
    }

    // Delete entry (placeholder for future implementation)
    deleteEntry(key) {
        if (confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
            // Implement delete functionality
            console.log('Deleting entry:', key);
        }
    }

    // Show modal
    showModal(title, content) {
        const modal = document.getElementById('actionModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        if (!modal || !modalTitle || !modalBody) return;
        
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.style.display = 'block';
        
        // Close modal when clicking on X or outside
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = document.getElementById('modalCancel');
        
        if (closeBtn) {
            closeBtn.onclick = () => modal.style.display = 'none';
        }
        
        if (cancelBtn) {
            cancelBtn.onclick = () => modal.style.display = 'none';
        }
        
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    // Show error message
    showError(message) {
        // You can implement a toast notification system here
        alert(message);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new R7AdminDashboard();
});
