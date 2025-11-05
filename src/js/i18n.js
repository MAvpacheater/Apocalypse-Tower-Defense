// src/js/i18n.js - Internationalization System with JSON loading and events

class I18n {
    constructor() {
        this.currentLang = this.getStoredLanguage() || 'en';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.setupLanguageSwitcher();
        this.applyLanguage(this.currentLang);
    }

    async loadTranslations() {
        const languages = ['uk', 'en', 'ru'];
        
        // Визначаємо базовий шлях залежно від поточної сторінки
        const currentPath = window.location.pathname;
        const basePath = currentPath.includes('/src/res/') 
            ? '../locales/' 
            : 'src/locales/';
        
        for (const lang of languages) {
            try {
                const response = await fetch(`${basePath}${lang}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load ${lang}.json`);
                }
                this.translations[lang] = await response.json();
            } catch (error) {
                console.error(`Error loading translations for ${lang}:`, error);
                // Fallback to empty object
                this.translations[lang] = {};
            }
        }
    }

    getStoredLanguage() {
        return localStorage.getItem('language');
    }

    setStoredLanguage(lang) {
        localStorage.setItem('language', lang);
    }

    setupLanguageSwitcher() {
        const langToggle = document.getElementById('langToggle');
        const langDropdown = document.getElementById('langDropdown');
        const langOptions = document.querySelectorAll('.lang-option');

        langToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown?.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            langDropdown?.classList.remove('active');
        });

        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.dataset.lang;
                this.changeLanguage(lang);
                langDropdown?.classList.remove('active');
            });
        });
    }

    changeLanguage(lang) {
        if (!this.translations[lang]) {
            console.error(`Language ${lang} not found`);
            return;
        }

        this.currentLang = lang;
        this.setStoredLanguage(lang);
        this.applyLanguage(lang);
        this.updateLanguageButton(lang);
        
        // Dispatch custom event for language change
        const event = new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        });
        document.dispatchEvent(event);
    }

    applyLanguage(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            element.classList.add('translating');
            
            setTimeout(() => {
                const key = element.getAttribute('data-i18n');
                const translation = this.getTranslation(key, lang);
                
                if (translation) {
                    element.innerHTML = translation;
                }
                
                element.classList.remove('translating');
            }, 100);
        });

        document.documentElement.lang = lang;
    }

    getTranslation(key, lang) {
        const keys = key.split('.');
        let value = this.translations[lang];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return null;
            }
        }

        return value;
    }

    updateLanguageButton(lang) {
        const currentLangText = document.getElementById('currentLang');
        const langOptions = document.querySelectorAll('.lang-option');

        if (currentLangText) {
            currentLangText.textContent = lang.toUpperCase();
        }

        langOptions.forEach(option => {
            if (option.dataset.lang === lang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    t(key) {
        return this.getTranslation(key, this.currentLang);
    }
}

// Initialize i18n system
const i18n = new I18n();
window.i18n = i18n;
