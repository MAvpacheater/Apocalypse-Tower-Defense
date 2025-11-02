// src/js/theme.js - Theme Management System

class ThemeManager {
    constructor() {
        this.themes = ['dark', 'light', 'zombie'];
        this.currentTheme = this.getStoredTheme() || 'dark';
        this.themeIcons = {
            dark: '🌙',
            light: '☀️',
            zombie: '🧟'
        };
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeSwitcher();
        this.updateThemeIcon();
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    setupThemeSwitcher() {
        const themeToggle = document.getElementById('themeToggle');
        
        themeToggle?.addEventListener('click', () => {
            this.cycleTheme();
        });

        // Optional: Listen for system theme changes
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeQuery.addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    cycleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        const nextTheme = this.themes[nextIndex];
        
        this.changeTheme(nextTheme);
    }

    changeTheme(theme) {
        if (!this.themes.includes(theme)) {
            console.error(`Theme ${theme} not found`);
            return;
        }

        this.currentTheme = theme;
        this.setStoredTheme(theme);
        this.applyTheme(theme);
        this.updateThemeIcon();
        this.announceThemeChange(theme);
    }

    applyTheme(theme) {
        // Remove all theme classes
        this.themes.forEach(t => {
            document.body.removeAttribute(`data-theme-${t}`);
        });

        // Add new theme
        document.body.setAttribute('data-theme', theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
    }

    updateMetaThemeColor(theme) {
        let themeColor;
        
        switch(theme) {
            case 'light':
                themeColor = '#f8fafc';
                break;
            case 'zombie':
                themeColor = '#0d1b0d';
                break;
            default:
                themeColor = '#0a0e1a';
        }

        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = themeColor;
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.themeIcons[this.currentTheme];
        }
    }

    announceThemeChange(theme) {
        // Create a subtle notification
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.textContent = `${this.themeIcons[theme]} ${this.getThemeName(theme)}`;
        notification.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--color-bg-tertiary);
            color: var(--color-text-primary);
            padding: 1rem 1.5rem;
            border-radius: 12px;
            border: 1px solid var(--color-border);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            font-weight: 600;
            z-index: 9999;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    getThemeName(theme) {
        const names = {
            dark: 'Dark Theme',
            light: 'Light Theme',
            zombie: 'Zombie Theme'
        };
        return names[theme] || theme;
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    setTheme(theme) {
        this.changeTheme(theme);
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export for use in other modules
window.themeManager = themeManager;

// Add smooth theme transition to body
document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
