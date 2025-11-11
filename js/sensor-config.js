/* ============================================
   SENSOR CONFIGURATION - JAVASCRIPT LOGIC
   ============================================ */

// Global Sensor State
const sensorState = {
    selectedSensor: null,
    sensors: [
        {
            id: 'SN-CANAL-01-NS',
            name: 'Canal Sensor 01',
            location: 'North Sector, Pier 4',
            type: 'Ultrasonic',
            status: 'Online',
            warningLevel: 4.0,
            criticalLevel: 7.5,
            battery: '85%'
        },
        {
            id: 'SN-RES-02-NS',
            name: 'Reservoir Sensor 02',
            location: 'South Zone, Reservoir',
            type: 'Pressure',
            status: 'Offline',
            warningLevel: 3.5,
            criticalLevel: 6.5,
            battery: '45%'
        },
        {
            id: 'SN-RIVER-03-NS',
            name: 'River Sensor 03',
            location: 'Riverbed Area',
            type: 'Radar',
            status: 'Online',
            warningLevel: 5.0,
            criticalLevel: 8.0,
            battery: '92%'
        }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeSensorConfig();
    setupEventListeners();
});

/**
 * Initialize Sensor Configuration
 */
function initializeSensorConfig() {
    renderSensorList();
    if (sensorState.sensors.length > 0) {
        selectSensor(0);
    }
}

/**
 * Render Sensor List
 */
function renderSensorList() {
    const sensorList = document.querySelector('.sensor-list');
    if (!sensorList) return;

    sensorList.innerHTML = '';

    sensorState.sensors.forEach((sensor, index) => {
        const isOnline = sensor.status === 'Online';
        const statusColor = isOnline ? 'online' : 'offline';
        const statusText = isOnline ? 'Online' : 'Offline';
        const textColor = isOnline ? 'text-success' : 'text-danger';

        const sensorItem = document.createElement('div');
        sensorItem.className = `sensor-item ${sensorState.selectedSensor === index ? 'active' : ''}`;
        sensorItem.innerHTML = `
            <div class="d-flex align-items-center">
                <span class="sensor-status ${statusColor}"></span>
                <div class="flex-grow-1">
                    <div class="sensor-name">${sensor.name.substring(0, 12)}...</div>
                    <small class="${textColor}">${statusText}</small>
                </div>
                <i class="bi bi-chevron-right"></i>
            </div>
        `;

        sensorItem.addEventListener('click', () => selectSensor(index));
        sensorList.appendChild(sensorItem);
    });
}

/**
 * Select Sensor
 */
function selectSensor(index) {
    sensorState.selectedSensor = index;
    const sensor = sensorState.sensors[index];

    document.querySelectorAll('.sensor-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    updateConfigPanel(sensor);
}

/**
 * Update Configuration Panel
 */
function updateConfigPanel(sensor) {
    const inputs = document.querySelectorAll('input[type="text"][disabled]');
    if (inputs.length >= 3) {
        inputs[0].value = sensor.name;
        inputs[1].value = sensor.location;
        inputs[2].value = sensor.id;
    }

    const typeSelect = document.querySelector('select');
    if (typeSelect) {
        typeSelect.value = sensor.type;
    }

    const ranges = document.querySelectorAll('input[type="range"]');
    const numberInputs = document.querySelectorAll('input[type="number"]');

    if (ranges.length >= 2 && numberInputs.length >= 2) {
        ranges[0].value = sensor.warningLevel;
        numberInputs[0].value = sensor.warningLevel;

        ranges[1].value = sensor.criticalLevel;
        numberInputs[1].value = sensor.criticalLevel;
    }

    updateStatusTable(sensor);
}

/**
 * Update Status Table
 */
function updateStatusTable(sensor) {
    const tbody = document.querySelector('.table tbody');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td>
                <span class="badge ${sensor.status === 'Online' ? 'bg-success' : 'bg-danger'}">
                    ${sensor.status === 'Online' ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>${sensor.battery}</td>
            <td>${(Math.random() * 4 + 2).toFixed(2)}m</td>
            <td>${Math.floor(Math.random() * 5) + 1} min ago</td>
        </tr>
    `;
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    const addSensorBtn = document.querySelector('.btn-info');
    if (addSensorBtn) {
        addSensorBtn.addEventListener('click', handleAddSensor);
    }

    const searchInput = document.querySelector('input[placeholder="Find sensor by name"]');
    if (searchInput) {
        searchInput.addEventListener('input', handleSensorSearch);
    }

    const ranges = document.querySelectorAll('input[type="range"]');
    ranges.forEach((range, index) => {
        range.addEventListener('input', (e) => {
            handleRangeChange(e, index);
        });
    });

    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach((input, index) => {
        input.addEventListener('change', (e) => {
            handleNumberChange(e, index);
        });
    });

    const saveBtn = document.querySelector('.btn-primary');
    if (saveBtn) {
        saveBtn.addEventListener('click', handleSaveChanges);
    }

    const cancelBtn = document.querySelector('.btn-outline-secondary');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', handleCancel);
    }

    const typeSelect = document.querySelector('select');
    if (typeSelect) {
        typeSelect.addEventListener('change', (e) => {
            handleTypeChange(e);
        });
    }
}

/**
 * Handle Sensor Search
 */
function handleSensorSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredSensors = sensorState.sensors.filter(sensor =>
        sensor.name.toLowerCase().includes(searchTerm) ||
        sensor.id.toLowerCase().includes(searchTerm)
    );

    const sensorList = document.querySelector('.sensor-list');
    if (sensorList) {
        sensorList.innerHTML = '';

        if (filteredSensors.length === 0) {
            sensorList.innerHTML = '<p class="text-muted text-center py-3">No sensors found</p>';
            return;
        }

        filteredSensors.forEach((sensor, index) => {
            const originalIndex = sensorState.sensors.indexOf(sensor);
            const isOnline = sensor.status === 'Online';
            const statusColor = isOnline ? 'online' : 'offline';
            const textColor = isOnline ? 'text-success' : 'text-danger';

            const sensorItem = document.createElement('div');
            sensorItem.className = `sensor-item ${sensorState.selectedSensor === originalIndex ? 'active' : ''}`;
            sensorItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <span class="sensor-status ${statusColor}"></span>
                    <div class="flex-grow-1">
                        <div class="sensor-name">${sensor.name}</div>
                        <small class="${textColor}">${sensor.status}</small>
                    </div>
                    <i class="bi bi-chevron-right"></i>
                </div>
            `;

            sensorItem.addEventListener('click', () => selectSensor(originalIndex));
            sensorList.appendChild(sensorItem);
        });
    }
}

/**
 * Handle Range Change
 */
function handleRangeChange(e, index) {
    const value = e.target.value;
    const numberInputs = document.querySelectorAll('input[type="number"]');

    if (numberInputs[index]) {
        numberInputs[index].value = value;
    }

    if (sensorState.selectedSensor !== null) {
        const sensor = sensorState.sensors[sensorState.selectedSensor];
        if (index === 0) {
            sensor.warningLevel = parseFloat(value);
        } else {
            sensor.criticalLevel = parseFloat(value);
        }
    }
}

/**
 * Handle Number Input Change
 */
function handleNumberChange(e, index) {
    const value = e.target.value;
    const ranges = document.querySelectorAll('input[type="range"]');

    if (ranges[index]) {
        ranges[index].value = value;
    }

    if (sensorState.selectedSensor !== null) {
        const sensor = sensorState.sensors[sensorState.selectedSensor];
        if (index === 0) {
            sensor.warningLevel = parseFloat(value);
        } else {
            sensor.criticalLevel = parseFloat(value);
        }
    }
}

/**
 * Handle Type Change
 */
function handleTypeChange(e) {
    if (sensorState.selectedSensor !== null) {
        sensorState.sensors[sensorState.selectedSensor].type = e.target.value;
    }
}

/**
 * Handle Add Sensor
 */
function handleAddSensor() {
    const newSensor = {
        id: `SN-NEW-${Date.now()}`,
        name: 'New Sensor',
        location: 'Enter Location',
        type: 'Ultrasonic',
        status: 'Offline',
        warningLevel: 3.0,
        criticalLevel: 5.0,
        battery: '0%'
    };

    sensorState.sensors.push(newSensor);
    renderSensorList();
    selectSensor(sensorState.sensors.length - 1);

    showNotification('New sensor added. Configure and save changes.', 'success');
}

/**
 * Handle Save Changes
 */
function handleSaveChanges() {
    if (sensorState.selectedSensor === null) {
        showNotification('Select a sensor first', 'warning');
        return;
    }

    const sensor = sensorState.sensors[sensorState.selectedSensor];

    if (sensor.warningLevel >= sensor.criticalLevel) {
        showNotification('Warning level must be less than critical level', 'danger');
        return;
    }

    showNotification(`Changes saved for ${sensor.name}`, 'success');
}

/**
 * Handle Cancel
 */
function handleCancel() {
    if (sensorState.selectedSensor !== null) {
        updateConfigPanel(sensorState.sensors[sensorState.selectedSensor]);
        showNotification('Changes canceled', 'info');
    }
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    const alertType = {
        'success': 'success',
        'danger': 'danger',
        'warning': 'warning',
        'info': 'info'
    };

    const toast = document.createElement('div');
    toast.className = `alert alert-${alertType[type]} position-fixed`;
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.minWidth = '300px';
    toast.style.zIndex = '9999';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Auto-update status
setInterval(() => {
    if (sensorState.selectedSensor !== null) {
        updateStatusTable(sensorState.sensors[sensorState.selectedSensor]);
    }
}, 5000);
