// Theme System
class ThemeSystem {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.bindEvents();
        this.updateThemeButtons();
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('hotel_theme') || 'light';
        this.setTheme(savedTheme);
    }

    bindEvents() {
        // Theme toggle buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'themeToggle' || e.target.id === 'mobileThemeToggle') {
                this.toggleTheme();
            }
        });

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('hotel_theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('hotel_theme', theme);
        
        // Update document attribute
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme buttons
        this.updateThemeButtons();
        
        // Trigger theme change event
        this.dispatchThemeChangeEvent();
    }

    updateThemeButtons() {
        const themeButtons = document.querySelectorAll('#themeToggle, #mobileThemeToggle');
        themeButtons.forEach(button => {
            if (button) {
                button.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
                button.title = this.currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
            }
        });
    }

    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themechange', {
            detail: { theme: this.currentTheme }
        });
        document.dispatchEvent(event);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    isLightMode() {
        return this.currentTheme === 'light';
    }

    // Method to get theme-specific colors
    getThemeColors() {
        const colors = {
            light: {
                primary: '#2563eb',
                secondary: '#64748b',
                accent: '#f59e0b',
                success: '#10b981',
                danger: '#ef4444',
                warning: '#f59e0b',
                background: '#ffffff',
                surface: '#f8fafc',
                text: '#1e293b',
                textSecondary: '#64748b'
            },
            dark: {
                primary: '#3b82f6',
                secondary: '#cbd5e1',
                accent: '#fbbf24',
                success: '#34d399',
                danger: '#f87171',
                warning: '#fbbf24',
                background: '#0f172a',
                surface: '#1e293b',
                text: '#f8fafc',
                textSecondary: '#cbd5e1'
            }
        };
        
        return colors[this.currentTheme];
    }

    // Method to apply theme to specific elements
    applyThemeToElement(element, styles) {
        const themeColors = this.getThemeColors();
        
        Object.entries(styles).forEach(([property, colorKey]) => {
            if (themeColors[colorKey]) {
                element.style.setProperty(property, themeColors[colorKey]);
            }
        });
    }

    // Method to create theme-aware CSS custom properties
    updateCSSCustomProperties() {
        const root = document.documentElement;
        const colors = this.getThemeColors();
        
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--theme-${key}`, value);
        });
    }

    // Method to get system theme preference
    getSystemThemePreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Method to reset to system theme
    resetToSystemTheme() {
        const systemTheme = this.getSystemThemePreference();
        this.setTheme(systemTheme);
        localStorage.removeItem('hotel_theme');
    }

    // Method to check if user has theme preference
    hasUserThemePreference() {
        return localStorage.getItem('hotel_theme') !== null;
    }

    // Method to animate theme transition
    animateThemeTransition() {
        document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }

    // Method to get theme-specific icons
    getThemeIcon(iconName) {
        const icons = {
            light: {
                sun: '☀️',
                moon: '🌙',
                star: '⭐',
                check: '✅',
                cross: '❌',
                info: 'ℹ️',
                warning: '⚠️'
            },
            dark: {
                sun: '☀️',
                moon: '🌙',
                star: '⭐',
                check: '✅',
                cross: '❌',
                info: 'ℹ️',
                warning: '⚠️'
            }
        };
        
        return icons[this.currentTheme][iconName] || '';
    }

    // Method to handle theme-specific images
    getThemedImageSrc(lightSrc, darkSrc) {
        return this.currentTheme === 'dark' ? darkSrc : lightSrc;
    }

    // Method to add theme change listener
    onThemeChange(callback) {
        document.addEventListener('themechange', callback);
    }

    // Method to remove theme change listener
    offThemeChange(callback) {
        document.removeEventListener('themechange', callback);
    }
}

// Initialize theme system
document.addEventListener('DOMContentLoaded', () => {
    window.themeSystem = new ThemeSystem();
    
    // Update CSS custom properties on theme change
    window.themeSystem.onThemeChange(() => {
        window.themeSystem.updateCSSCustomProperties();
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSystem;
}