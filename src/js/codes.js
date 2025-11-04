// src/js/codes.js - Codes Page Functionality

// Active codes with their rewards
const activeCodes = [
    {
        code: 'MrDep',
        reward: '100 coins',
        icon: '💰',
        type: 'common'
    },
    {
        code: 'Darth',
        reward: '100 coins',
        icon: '💰',
        type: 'common'
    },
    {
        code: 'Never',
        reward: '150 coins',
        icon: '💎',
        type: 'rare'
    },
    {
        code: 'Jask_wantse',
        reward: '100 coins',
        icon: '💰',
        type: 'common'
    },
    {
        code: 'AdminArbuz',
        reward: '200 coins',
        icon: '💎',
        type: 'rare'
    },
    {
        code: 'Zoag',
        reward: '350 coins',
        icon: '🏆',
        type: 'epic'
    },
    {
        code: 'T1Ran',
        reward: '250 coins',
        icon: '💎',
        type: 'rare'
    },
    {
        code: 'Ferdinand',
        reward: '75 coins',
        icon: '💰',
        type: 'common'
    },
    {
        code: 'RELEASE',
        reward: 'Limited Axe Man',
        icon: '🪓',
        type: 'legendary'
    }
];

// Expired codes (example)
const expiredCodes = [
];

// Type badges configuration
const typeBadges = {
    common: { label: 'Common', color: '#9ca3af' },
    rare: { label: 'Rare', color: '#3b82f6' },
    epic: { label: 'Epic', color: '#a855f7' },
    legendary: { label: 'Legendary', color: '#f59e0b' }
};

// Initialize codes page
document.addEventListener('DOMContentLoaded', () => {
    renderActiveCodes();
    renderExpiredCodes();
    setupCopyButtons();
});

// Render active codes
function renderActiveCodes() {
    const codesGrid = document.getElementById('codesGrid');
    if (!codesGrid) return;

    codesGrid.innerHTML = activeCodes.map(codeData => {
        const isSpecial = codeData.type === 'legendary' || codeData.type === 'epic';
        return `
            <div class="code-card ${isSpecial ? 'special' : ''}" data-code="${codeData.code}">
                <div class="code-header">
                    <div class="code-name">${codeData.code}</div>
                    <div class="code-badge" style="color: ${typeBadges[codeData.type].color};">
                        ${typeBadges[codeData.type].label}
                    </div>
                </div>
                <div class="code-reward">
                    <div class="reward-icon">${codeData.icon}</div>
                    <div class="reward-text">
                        <div class="reward-label">Винагорода:</div>
                        <div class="reward-value">${codeData.reward}</div>
                    </div>
                </div>
                <div class="code-actions">
                    <button class="btn-copy" data-code="${codeData.code}">
                        <span class="icon">📋</span>
                        <span class="text">Скопіювати</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Render expired codes
function renderExpiredCodes() {
    const expiredCodesContainer = document.getElementById('expiredCodes');
    if (!expiredCodesContainer) return;

    if (expiredCodes.length === 0) {
        expiredCodesContainer.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">Немає неактивних кодів</p>';
        return;
    }

    expiredCodesContainer.innerHTML = expiredCodes.map(code => `
        <div class="expired-code">
            <div class="expired-code-name">${code}</div>
        </div>
    `).join('');
}

// Setup copy buttons
function setupCopyButtons() {
    const copyButtons = document.querySelectorAll('.btn-copy');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            copyToClipboard(code, this);
        });
    });
}

// Copy to clipboard function
async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        showSuccessState(button);
        showToast();
    } catch (err) {
        // Fallback for older browsers
        fallbackCopyToClipboard(text, button);
    }
}

// Fallback copy method
function fallbackCopyToClipboard(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showSuccessState(button);
        showToast();
    } catch (err) {
        console.error('Failed to copy:', err);
    }
    
    document.body.removeChild(textArea);
}

// Show success state on button
function showSuccessState(button) {
    const originalHTML = button.innerHTML;
    button.classList.add('copied');
    button.innerHTML = '<span class="icon">✓</span><span class="text">Скопійовано!</span>';
    
    setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = originalHTML;
    }, 2000);
}

// Show toast notification
function showToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Update codes dynamically (for future API integration)
function updateCodes(newCodes) {
    activeCodes.length = 0;
    activeCodes.push(...newCodes);
    renderActiveCodes();
    setupCopyButtons();
}

// Search functionality (optional - can be added later)
function searchCodes(query) {
    const cards = document.querySelectorAll('.code-card');
    const searchLower = query.toLowerCase();
    
    cards.forEach(card => {
        const code = card.getAttribute('data-code').toLowerCase();
        const match = code.includes(searchLower);
        card.style.display = match ? 'block' : 'none';
    });
}

// Export functions for external use
window.codesManager = {
    updateCodes,
    searchCodes,
    activeCodes,
    expiredCodes
};

// Log initialization
console.log('%c🎁 Codes Page Loaded', 'color: #22c55e; font-size: 14px; font-weight: bold;');
console.log(`%cActive codes: ${activeCodes.length}`, 'color: #9ca3af;');
console.log(`%cExpired codes: ${expiredCodes.length}`, 'color: #9ca3af;');
