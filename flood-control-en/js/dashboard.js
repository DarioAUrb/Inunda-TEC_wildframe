/* ============================================
   DASHBOARD - JAVASCRIPT FUNCTIONALITY
   ============================================ */

// Chart.js Configuration
Chart.defaults.color = '#a0aec0';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';

// Temperature Chart Data
const temperatureData = {
    labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [{
        label: 'Temperature (°C)',
        data: [12, 14, 16, 19, 22, 25, 27, 26, 23, 19, 15, 13],
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#dc3545',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
    }]
};

// Chart Options
const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 30,
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                drawBorder: false
            },
            ticks: {
                color: '#a0aec0'
            }
        },
        x: {
            grid: {
                display: false,
                drawBorder: false
            },
            ticks: {
                color: '#a0aec0',
                font: {
                    size: 12
                }
            }
        }
    }
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('temperatureChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: temperatureData,
            options: chartOptions
        });
    }

    initializeDashboard();
});

/**
 * Initialize Dashboard Functionality
 */
function initializeDashboard() {
    // Metric Cards Interactivity
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Map SVG Markers
    const mapSvg = document.querySelector('.map-svg');
    if (mapSvg) {
        const circles = mapSvg.querySelectorAll('circle[fill="#dc3545"]');
        circles.forEach((circle, index) => {
            circle.addEventListener('mouseenter', function() {
                this.setAttribute('r', '12');
            });

            circle.addEventListener('mouseleave', function() {
                this.setAttribute('r', '8');
            });

            circle.addEventListener('click', function() {
                showMarkerInfo(index);
            });
        });
    }

    // Auto-refresh metrics
    setInterval(updateMetrics, 5000);
}

/**
 * Update Metrics with Simulated Data
 */
function updateMetrics() {
    const waterLevel = document.querySelector('.metric-card.bg-danger h3');
    const temperature = document.querySelector('.metric-card.bg-info h3');
    const humidity = document.querySelector('.metric-card.bg-warning h3');

    if (waterLevel) {
        const current = parseFloat(waterLevel.textContent);
        const change = (Math.random() - 0.5) * 0.1;
        const newValue = Math.max(0.5, Math.min(2.5, current + change));
        waterLevel.textContent = newValue.toFixed(2) + ' m';
    }

    if (temperature) {
        const current = parseFloat(temperature.textContent);
        const change = (Math.random() - 0.5) * 0.5;
        const newValue = Math.max(15, Math.min(45, current + change));
        temperature.textContent = Math.round(newValue) + '°C';
    }

    if (humidity) {
        const current = parseFloat(humidity.textContent);
        const change = (Math.random() - 0.5) * 2;
        const newValue = Math.max(20, Math.min(90, current + change));
        humidity.textContent = Math.round(newValue) + '%';
    }
}

/**
 * Show Marker Information
 */
function showMarkerInfo(index) {
    const alertsList = document.querySelector('.alerts-list');
    if (alertsList) {
        alertsList.scrollTop = 0;

        const alerts = alertsList.querySelectorAll('.alert-sm');
        alerts.forEach((alert, i) => {
            if (i === index) {
                alert.style.backgroundColor = 'rgba(255, 193, 7, 0.2)';
                alert.style.transform = 'scale(1.02)';
            } else {
                alert.style.backgroundColor = '';
                alert.style.transform = 'scale(1)';
            }
        });

        setTimeout(() => {
            alerts.forEach(alert => {
                alert.style.backgroundColor = '';
                alert.style.transform = '';
            });
        }, 2000);
    }
}

/**
 * Utility Functions
 */

function updateSensorStatus(sensorId, status) {
    console.log(`Sensor ${sensorId} status: ${status}`);
}

function exportData(format) {
    console.log(`Exporting data in format: ${format}`);
}

function refreshData() {
    console.log('Refreshing data...');
    updateMetrics();
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshData();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportData('CSV');
    }
});

/**
 * Show Notification Toast
 */
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed`;
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.minWidth = '300px';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        <i class="bi bi-${getIconForType(type)}"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function getIconForType(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Simulate New Alert
 */
function simulateNewAlert() {
    const alertType = ['danger', 'warning', 'info'][Math.floor(Math.random() * 3)];
    const messages = {
        'danger': 'Critical alert detected in Canal 4B',
        'warning': 'High water level at Pump Station A',
        'info': 'Reading updated for Sensor RB-05'
    };

    showNotification(messages[alertType], alertType);
}
