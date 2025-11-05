// src/js/updates.js - Updates Page Functionality

let updates = [];

// Initialize updates page
document.addEventListener('DOMContentLoaded', async () => {
    await loadUpdatesFromJSON();
    renderUpdates();
    logInitialization();
});

// Load updates from JSON file
async function loadUpdatesFromJSON() {
    try {
        const response = await fetch('../res/updates.json');
        if (!response.ok) {
            throw new Error('Failed to load updates.json');
        }
        const data = await response.json();
        updates = data.updates || [];
    } catch (error) {
        console.error('Error loading updates:', error);
        updates = [];
    }
}

// Render updates timeline
function renderUpdates() {
    const timeline = document.getElementById('updatesTimeline');
    if (!timeline) return;

    if (updates.length === 0) {
        timeline.innerHTML = `
            <div class="updates-empty">
                <div class="updates-empty-icon">📋</div>
                <p class="updates-empty-text">No updates available yet</p>
            </div>
        `;
        return;
    }

    timeline.innerHTML = updates.map((update, index) => {
        const isNew = index === 0; // First update is marked as new
        const badgeType = update.type || 'major';
        
        return `
            <div class="update-item">
                <div class="update-marker ${isNew ? 'new' : ''}">
                    ${getUpdateIcon(badgeType)}
                </div>
                <div class="update-card ${isNew ? 'new' : ''}">
                    <div class="update-header">
                        <span class="update-date">${update.date}</span>
                        <span class="update-badge ${badgeType}">${getBadgeText(badgeType)}</span>
                    </div>
                    <h3 class="update-version">${update.version}</h3>
                    <h4 class="update-title">${update.title}</h4>
                    <p class="update-description">${update.description}</p>
                    ${renderChanges(update.changes)}
                </div>
            </div>
        `;
    }).join('');
}

// Render changes list
function renderChanges(changes) {
    if (!changes || Object.keys(changes).length === 0) return '';

    let html = '<div class="update-changes">';

    if (changes.added && changes.added.length > 0) {
        html += `
            <h4>✨ Added</h4>
            <ul>
                ${changes.added.map(item => `<li class="change-added">${item}</li>`).join('')}
            </ul>
        `;
    }

    if (changes.improved && changes.improved.length > 0) {
        html += `
            <h4>⚡ Improved</h4>
            <ul>
                ${changes.improved.map(item => `<li class="change-improved">${item}</li>`).join('')}
            </ul>
        `;
    }

    if (changes.fixed && changes.fixed.length > 0) {
        html += `
            <h4>🔧 Fixed</h4>
            <ul>
                ${changes.fixed.map(item => `<li class="change-fixed">${item}</li>`).join('')}
            </ul>
        `;
    }

    if (changes.removed && changes.removed.length > 0) {
        html += `
            <h4>🗑️ Removed</h4>
            <ul>
                ${changes.removed.map(item => `<li class="change-removed">${item}</li>`).join('')}
            </ul>
        `;
    }

    html += '</div>';
    return html;
}

// Get icon for update type
function getUpdateIcon(type) {
    const icons = {
        major: '🚀',
        minor: '✨',
        patch: '🔧'
    };
    return icons[type] || '📋';
}

// Get badge text for update type
function getBadgeText(type) {
    const texts = {
        major: 'Major',
        minor: 'Minor',
        patch: 'Patch'
    };
    return texts[type] || 'Update';
}

// Log initialization
function logInitialization() {
    console.log('%c📋 Updates Page Loaded', 'color: #22c55e; font-size: 14px; font-weight: bold;');
    console.log(`%cTotal updates: ${updates.length}`, 'color: #9ca3af;');
}

// Export for external use
window.updatesManager = {
    updates,
    loadUpdatesFromJSON,
    renderUpdates
};
