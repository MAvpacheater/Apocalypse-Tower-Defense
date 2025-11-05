// src/js/updates.js - Updates Page Functionality with i18n support

let updates = [];
let currentLang = 'en';

// Initialize updates page
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for i18n to be initialized
    await waitForI18n();
    currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
    
    await loadUpdatesFromJSON();
    renderUpdates();
    logInitialization();
    
    // Listen for language changes
    document.addEventListener('languageChanged', () => {
        currentLang = window.i18n ? window.i18n.getCurrentLanguage() : 'en';
        renderUpdates();
    });
});

// Wait for i18n to be ready
function waitForI18n() {
    return new Promise((resolve) => {
        if (window.i18n && window.i18n.translations) {
            resolve();
        } else {
            const checkInterval = setInterval(() => {
                if (window.i18n && window.i18n.translations) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 50);
            
            // Timeout after 3 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 3000);
        }
    });
}

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

// Get translated text
function getTranslatedText(textObj) {
    if (typeof textObj === 'string') return textObj;
    return textObj[currentLang] || textObj['en'] || '';
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
        const isNew = index === 0;
        const badgeType = update.type || 'major';
        
        return `
            <div class="update-item">
                <div class="update-marker ${isNew ? 'new' : ''}">
                    ${getUpdateIcon(badgeType)}
                </div>
                <div class="update-card ${isNew ? 'new' : ''}">
                    <div class="update-header">
                        <span class="update-date">${getTranslatedText(update.date)}</span>
                        <span class="update-badge ${badgeType}">${getBadgeText(badgeType)}</span>
                    </div>
                    <h3 class="update-version">${update.version}</h3>
                    <h4 class="update-title">${getTranslatedText(update.title)}</h4>
                    <p class="update-description">${getTranslatedText(update.description)}</p>
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

    // Added
    const addedItems = getTranslatedText(changes.added);
    if (addedItems && addedItems.length > 0) {
        html += `
            <h4>✨ ${getChangeTitle('added')}</h4>
            <ul>
                ${addedItems.map(item => `<li class="change-added">${item}</li>`).join('')}
            </ul>
        `;
    }

    // Improved
    const improvedItems = getTranslatedText(changes.improved);
    if (improvedItems && improvedItems.length > 0) {
        html += `
            <h4>⚡ ${getChangeTitle('improved')}</h4>
            <ul>
                ${improvedItems.map(item => `<li class="change-improved">${item}</li>`).join('')}
            </ul>
        `;
    }

    // Fixed
    const fixedItems = getTranslatedText(changes.fixed);
    if (fixedItems && fixedItems.length > 0) {
        html += `
            <h4>🔧 ${getChangeTitle('fixed')}</h4>
            <ul>
                ${fixedItems.map(item => `<li class="change-fixed">${item}</li>`).join('')}
            </ul>
        `;
    }

    // Removed
    const removedItems = getTranslatedText(changes.removed);
    if (removedItems && removedItems.length > 0) {
        html += `
            <h4>🗑️ ${getChangeTitle('removed')}</h4>
            <ul>
                ${removedItems.map(item => `<li class="change-removed">${item}</li>`).join('')}
            </ul>
        `;
    }

    html += '</div>';
    return html;
}

// Get change section title
function getChangeTitle(type) {
    const titles = {
        added: {
            en: 'Added',
            uk: 'Додано',
            ru: 'Добавлено'
        },
        improved: {
            en: 'Improved',
            uk: 'Покращено',
            ru: 'Улучшено'
        },
        fixed: {
            en: 'Fixed',
            uk: 'Виправлено',
            ru: 'Исправлено'
        },
        removed: {
            en: 'Removed',
            uk: 'Видалено',
            ru: 'Удалено'
        }
    };
    
    return titles[type][currentLang] || titles[type]['en'];
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
        major: {
            en: 'Major',
            uk: 'Великий',
            ru: 'Крупный'
        },
        minor: {
            en: 'Minor',
            uk: 'Малий',
            ru: 'Малый'
        },
        patch: {
            en: 'Patch',
            uk: 'Патч',
            ru: 'Патч'
        }
    };
    
    const typeTexts = texts[type] || texts['major'];
    return typeTexts[currentLang] || typeTexts['en'];
}

// Log initialization
function logInitialization() {
    console.log('%c📋 Updates Page Loaded', 'color: #22c55e; font-size: 14px; font-weight: bold;');
    console.log(`%cTotal updates: ${updates.length}`, 'color: #9ca3af;');
    console.log(`%cLanguage: ${currentLang}`, 'color: #9ca3af;');
}

// Export for external use
window.updatesManager = {
    updates,
    loadUpdatesFromJSON,
    renderUpdates,
    currentLang
};
