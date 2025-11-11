/* ============================================
   ALERTS - JAVASCRIPT LOGIC
   ============================================ */

// Global Alerts State
const alertsState = {
    allAlerts: [
        {
            timestamp: '2023-10-27 14:35:10',
            location: 'Canal Section 4B - Sensor 04B-01',
            severity: 'Critical',
            waterLevel: '3.52m (Threshold: 3.50m)',
            details: 'Water level exceeded critical threshold'
        },
        {
            timestamp: '2023-10-27 09:15:45',
            location: 'Pump Station A - Sensor PSA-03',
            severity: 'Warning',
            waterLevel: '2.98m (Threshold: 3.00m)',
            details: 'Water level approaching warning threshold'
        },
        {
            timestamp: '2023-10-26 21:05:22',
            location: 'Riverbed Area - Sensor RB-05',
            severity: 'Critical',
            waterLevel: '4.10m (Threshold: 4.00m)',
            details: 'Critical water level detected'
        },
        {
            timestamp: '2023-10-26 11:30:00',
            location: 'Canal Section 2A - Sensor C2A-02',
            severity: 'Warning',
            waterLevel: '2.45m (Threshold: 2.50m)',
            details: 'Water level warning detected'
        },
        {
            timestamp: '2023-10-25 18:45:13',
            location: 'Downtown Bridge - Sensor DB-01',
            severity: 'Informational',
            waterLevel: '1.50m (Threshold: 1.50m)',
            details: 'Routine sensor reading'
        }
    ],
    currentPage: 1,
    itemsPerPage: 5,
    filters: {
        dateRange: 'Last 7 Days',
        severity: 'All',
        location: 'All'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeAlerts();
    setupEventListeners();
    renderAlerts();
});

/**
 * Initialize Alerts
 */
function initializeAlerts() {
    console.log('Alerts initialized');
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    const dateRangeBtn = document.querySelectorAll('.btn-dark')[0];
    const severityBtn = document.querySelectorAll('.btn-dark')[1];
    const locationBtn = document.querySelectorAll('.btn-dark')[2];

    if (dateRangeBtn) {
        dateRangeBtn.addEventListener('click', () => showDateRangeMenu(dateRangeBtn));
    }
    if (severityBtn) {
        severityBtn.addEventListener('click', () => showSeverityMenu(severityBtn));
    }
    if (locationBtn) {
        locationBtn.addEventListener('click', () => showLocationMenu(locationBtn));
    }

    const exportBtn = document.querySelector('.btn-info');
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExport);
    }

    const paginationButtons = document.querySelectorAll('.page-link');
    paginationButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pageNum = parseInt(btn.textContent);
            if (!isNaN(pageNum)) {
                handlePageChange(pageNum);
            }
        });
    });

    const prevBtn = document.querySelector('.btn-outline-secondary');
    const nextBtn = document.querySelectorAll('.btn-outline-secondary')[1];

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (alertsState.currentPage > 1) {
                alertsState.currentPage--;
                renderAlerts();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxPages = Math.ceil(alertsState.allAlerts.length / alertsState.itemsPerPage);
            if (alertsState.currentPage < maxPages) {
                alertsState.currentPage++;
                renderAlerts();
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('link-info')) {
            e.preventDefault();
            const row = e.target.closest('tr');
            if (row) {
                const cells = row.querySelectorAll('td');
                const alertData = {
                    timestamp: cells[0].textContent,
                    location: cells[1].textContent,
                    severity: cells[2].textContent.trim(),
                    waterLevel: cells[3].textContent
                };
                showAlertDetails(alertData);
            }
        }
    });
}

/**
 * Render Alerts
 */
function renderAlerts() {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    const start = (alertsState.currentPage - 1) * alertsState.itemsPerPage;
    const end = start + alertsState.itemsPerPage;
    const paginatedAlerts = alertsState.allAlerts.slice(start, end);

    tbody.innerHTML = '';

    paginatedAlerts.forEach((alert, index) => {
        const row = createAlertRow(alert, start + index);
        tbody.appendChild(row);
    });

    updatePagination();
}

/**
 * Create Alert Row
 */
function createAlertRow(alert, index) {
    const row = document.createElement('tr');
    row.className = 'alert-row';
    row.style.animationDelay = `${index * 0.05}s`;

    const severityClass = alert.severity === 'Critical' ? 'bg-danger' :
                         alert.severity === 'Warning' ? 'bg-warning' : 'bg-info';

    row.innerHTML = `
        <td class="ps-4">${alert.timestamp}</td>
        <td>${alert.location}</td>
        <td>
            <span class="badge ${severityClass}">${alert.severity}</span>
        </td>
        <td>${alert.waterLevel}</td>
        <td>
            <a href="#" class="link-info text-decoration-none">View Details <i class="bi bi-plus-circle"></i></a>
        </td>
    `;

    return row;
}

/**
 * Update Pagination
 */
function updatePagination() {
    const totalPages = Math.ceil(alertsState.allAlerts.length / alertsState.itemsPerPage);
    const pageLinks = document.querySelectorAll('.page-link');

    pageLinks.forEach(link => {
        const pageNum = parseInt(link.textContent);
        if (!isNaN(pageNum)) {
            link.parentElement.classList.toggle('active', pageNum === alertsState.currentPage);
        }
    });
}

/**
 * Handle Page Change
 */
function handlePageChange(pageNum) {
    alertsState.currentPage = pageNum;
    renderAlerts();

    const table = document.querySelector('.table');
    if (table) {
        table.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Handle Search
 */
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();

    const filteredAlerts = alertsState.allAlerts.filter(alert =>
        alert.location.toLowerCase().includes(searchTerm) ||
        alert.timestamp.toLowerCase().includes(searchTerm) ||
        alert.severity.toLowerCase().includes(searchTerm)
    );

    alertsState.allAlerts = filteredAlerts;
    alertsState.currentPage = 1;
    renderAlerts();

    if (filteredAlerts.length === 0) {
        const tbody = document.querySelector('.table tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No alerts found</td></tr>';
        }
    }
}

/**
 * Show Date Range Menu
 */
function showDateRangeMenu(button) {
    const menu = document.createElement('div');
    menu.className = 'dropdown-menu show';
    menu.style.cssText = 'position: absolute; top: 100%; left: 0; background-color: #2d3748; border: 1px solid #4a5568; border-radius: 0.375rem; min-width: 200px; z-index: 1000;';

    const options = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'All Time'];
    const items = options.map(option => `
        <a class="dropdown-item text-white" href="#" style="padding: 0.75rem 1rem; display: block; color: #a0aec0;">
            ${option}
        </a>
    `).join('');

    menu.innerHTML = items;

    button.parentElement.style.position = 'relative';
    button.parentElement.appendChild(menu);

    menu.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const selected = e.target.textContent.trim();
            alertsState.filters.dateRange = selected;
            button.innerHTML = `
                <i class="bi bi-calendar"></i> ${selected}
                <i class="bi bi-chevron-down float-end"></i>
            `;
            menu.remove();
        });
    });

    document.addEventListener('click', (e) => {
        if (!button.contains(e.target) && !menu.contains(e.target)) {
            menu.remove();
        }
    }, { once: true });
}

/**
 * Show Severity Menu
 */
function showSeverityMenu(button) {
    const menu = document.createElement('div');
    menu.className = 'dropdown-menu show';
    menu.style.cssText = 'position: absolute; top: 100%; left: 0; background-color: #2d3748; border: 1px solid #4a5568; border-radius: 0.375rem; min-width: 200px; z-index: 1000;';

    const options = ['All', 'Critical', 'Warning', 'Informational'];
    const items = options.map(option => `
        <a class="dropdown-item text-white" href="#" style="padding: 0.75rem 1rem; display: block; color: #a0aec0;">
            ${option}
        </a>
    `).join('');

    menu.innerHTML = items;

    button.parentElement.style.position = 'relative';
    button.parentElement.appendChild(menu);

    menu.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const selected = e.target.textContent.trim();
            alertsState.filters.severity = selected;
            button.innerHTML = `
                <i class="bi bi-exclamation-triangle"></i> Severity: ${selected}
                <i class="bi bi-chevron-down float-end"></i>
            `;
            menu.remove();
        });
    });

    document.addEventListener('click', (e) => {
        if (!button.contains(e.target) && !menu.contains(e.target)) {
            menu.remove();
        }
    }, { once: true });
}

/**
 * Show Location Menu
 */
function showLocationMenu(button) {
    const menu = document.createElement('div');
    menu.className = 'dropdown-menu show';
    menu.style.cssText = 'position: absolute; top: 100%; left: 0; background-color: #2d3748; border: 1px solid #4a5568; border-radius: 0.375rem; min-width: 200px; z-index: 1000;';

    const locations = new Set(alertsState.allAlerts.map(a => a.location.split(' - ')[0]));
    const options = ['All', ...Array.from(locations)];
    const items = options.map(option => `
        <a class="dropdown-item text-white" href="#" style="padding: 0.75rem 1rem; display: block; color: #a0aec0;">
            ${option}
        </a>
    `).join('');

    menu.innerHTML = items;

    button.parentElement.style.position = 'relative';
    button.parentElement.appendChild(menu);

    menu.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const selected = e.target.textContent.trim();
            alertsState.filters.location = selected;
            button.innerHTML = `
                <i class="bi bi-geo-alt"></i> Location: ${selected}
                <i class="bi bi-chevron-down float-end"></i>
            `;
            menu.remove();
        });
    });

    document.addEventListener('click', (e) => {
        if (!button.contains(e.target) && !menu.contains(e.target)) {
            menu.remove();
        }
    }, { once: true });
}

/**
 * Handle Export
 */
function handleExport() {
    const csv = convertToCSV(alertsState.allAlerts);
    downloadCSV(csv, 'alerts.csv');
    showNotification('Alerts exported as CSV', 'success');
}

/**
 * Convert to CSV
 */
function convertToCSV(alerts) {
    const headers = ['Timestamp', 'Location', 'Severity', 'Water Level', 'Details'];
    const rows = alerts.map(alert => [
        alert.timestamp,
        alert.location,
        alert.severity,
        alert.waterLevel,
        alert.details
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
}

/**
 * Download CSV
 */
function downloadCSV(csvContent, fileName) {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

/**
 * Show Alert Details
 */
function showAlertDetails(alertData) {
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.setAttribute('tabindex', '-1');
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content bg-dark border-secondary">
                <div class="modal-header border-secondary">
                    <h5 class="modal-title text-white">Alert Details</h5>
                    <button type="button" class="btn-close btn-close-white"></button>
                </div>
                <div class="modal-body text-white">
                    <p><strong>Timestamp:</strong> ${alertData.timestamp}</p>
                    <p><strong>Location:</strong> ${alertData.location}</p>
                    <p><strong>Severity:</strong> <span class="badge ${alertData.severity === 'Critical' ? 'bg-danger' : 'bg-warning'}">${alertData.severity}</span></p>
                    <p><strong>Water Level:</strong> ${alertData.waterLevel}</p>
                </div>
                <div class="modal-footer border-secondary">
                    <button type="button" class="btn btn-secondary">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.btn-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.btn-secondary').addEventListener('click', () => modal.remove());
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; min-width: 300px; z-index: 9999;';
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}
