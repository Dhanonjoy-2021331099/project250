// Language System
class LanguageSystem {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {
            en: {
                // Common
                'hotel_name': 'Hotel Paradise',
                'loading': 'Loading...',
                'save': 'Save',
                'cancel': 'Cancel',
                'delete': 'Delete',
                'edit': 'Edit',
                'add': 'Add',
                'search': 'Search',
                'clear': 'Clear',
                'print': 'Print',
                'download': 'Download',
                'back': 'Back',
                'next': 'Next',
                'previous': 'Previous',
                'close': 'Close',
                'confirm': 'Confirm',
                'yes': 'Yes',
                'no': 'No',
                
                // Authentication
                'sign_in': 'Sign In',
                'sign_up': 'Sign Up',
                'forgot_password': 'Forgot Password?',
                'reset_password': 'Reset Password',
                'email': 'Email',
                'password': 'Password',
                'confirm_password': 'Confirm Password',
                'full_name': 'Full Name',
                'phone_number': 'Phone Number',
                'login_success': 'Login successful!',
                'logout': 'Logout',
                
                // Dashboard
                'dashboard': 'Dashboard',
                'profile': 'Profile',
                'edit_profile': 'Edit Profile',
                'current_order': 'Current Order',
                'customer_name': 'Customer Name',
                'bill_number': 'Bill #',
                'subtotal': 'Subtotal',
                'tax': 'Tax (5%)',
                'total': 'Total',
                'generate_bill': 'Generate Bill',
                'clear_cart': 'Clear Cart',
                'print_bill': 'Print Bill',
                
                // Categories
                'breakfast': 'Breakfast',
                'lunch': 'Lunch',
                'dinner': 'Dinner',
                'snacks': 'Snacks',
                'beverages': 'Beverages',
                
                // Products
                'add_to_cart': 'Add to Cart',
                'remove_from_cart': 'Remove',
                'quantity': 'Quantity',
                'price': 'Price',
                'product_name': 'Product Name',
                'category': 'Category',
                
                // Manager
                'manager_panel': 'Manager Panel',
                'product_management': 'Product Management',
                'add_new_product': 'Add New Product',
                'manager_authentication': 'Manager Authentication',
                'manager_password': 'Manager Password',
                'access_panel': 'Access Panel',
                
                // Footer
                'contact': 'Contact',
                'follow_us': 'Follow Us',
                'luxury_accommodation': 'Luxury accommodation with exceptional service'
            },
            bn: {
                // Common
                'hotel_name': 'হোটেল প্যারাডাইস',
                'loading': 'লোড হচ্ছে...',
                'save': 'সংরক্ষণ',
                'cancel': 'বাতিল',
                'delete': 'মুছুন',
                'edit': 'সম্পাদনা',
                'add': 'যোগ করুন',
                'search': 'খুঁজুন',
                'clear': 'পরিষ্কার',
                'print': 'প্রিন্ট',
                'download': 'ডাউনলোড',
                'back': 'ফিরে যান',
                'next': 'পরবর্তী',
                'previous': 'পূর্ববর্তী',
                'close': 'বন্ধ',
                'confirm': 'নিশ্চিত',
                'yes': 'হ্যাঁ',
                'no': 'না',
                
                // Authentication
                'sign_in': 'সাইন ইন',
                'sign_up': 'সাইন আপ',
                'forgot_password': 'পাসওয়ার্ড ভুলে গেছেন?',
                'reset_password': 'পাসওয়ার্ড রিসেট',
                'email': 'ইমেইল',
                'password': 'পাসওয়ার্ড',
                'confirm_password': 'পাসওয়ার্ড নিশ্চিত করুন',
                'full_name': 'পূর্ণ নাম',
                'phone_number': 'ফোন নম্বর',
                'login_success': 'সফলভাবে লগইন হয়েছে!',
                'logout': 'লগআউট',
                
                // Dashboard
                'dashboard': 'ড্যাশবোর্ড',
                'profile': 'প্রোফাইল',
                'edit_profile': 'প্রোফাইল সম্পাদনা',
                'current_order': 'বর্তমান অর্ডার',
                'customer_name': 'গ্রাহকের নাম',
                'bill_number': 'বিল #',
                'subtotal': 'উপমোট',
                'tax': 'কর (৫%)',
                'total': 'মোট',
                'generate_bill': 'বিল তৈরি করুন',
                'clear_cart': 'কার্ট পরিষ্কার',
                'print_bill': 'বিল প্রিন্ট',
                
                // Categories
                'breakfast': 'নাস্তা',
                'lunch': 'দুপুরের খাবার',
                'dinner': 'রাতের খাবার',
                'snacks': 'নাস্তা',
                'beverages': 'পানীয়',
                
                // Products
                'add_to_cart': 'কার্টে যোগ করুন',
                'remove_from_cart': 'সরান',
                'quantity': 'পরিমাণ',
                'price': 'দাম',
                'product_name': 'পণ্যের নাম',
                'category': 'বিভাগ',
                
                // Manager
                'manager_panel': 'ম্যানেজার প্যানেল',
                'product_management': 'পণ্য ব্যবস্থাপনা',
                'add_new_product': 'নতুন পণ্য যোগ করুন',
                'manager_authentication': 'ম্যানেজার প্রমাণীকরণ',
                'manager_password': 'ম্যানেজার পাসওয়ার্ড',
                'access_panel': 'প্যানেল অ্যাক্সেস',
                
                // Footer
                'contact': 'যোগাযোগ',
                'follow_us': 'আমাদের অনুসরণ করুন',
                'luxury_accommodation': 'ব্যতিক্রমী সেবা সহ বিলাসবহুল আবাসন'
            }
        };
        
        this.init();
    }

    init() {
        this.loadSavedLanguage();
        this.bindEvents();
        this.updateLanguageButtons();
    }

    loadSavedLanguage() {
        const savedLang = localStorage.getItem('hotel_language') || 'en';
        this.setLanguage(savedLang);
    }

    bindEvents() {
        // Language toggle buttons
        document.addEventListener('click', (e) => {
            if (e.target.id === 'langToggle' || e.target.id === 'mobileLangToggle') {
                this.toggleLanguage();
            }
        });
    }

    toggleLanguage() {
        const newLang = this.currentLanguage === 'en' ? 'bn' : 'en';
        this.setLanguage(newLang);
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('hotel_language', lang);
        
        // Update document language
        document.documentElement.lang = lang;
        
        // Update all translatable elements
        this.updateTranslations();
        this.updateLanguageButtons();
        this.updatePlaceholders();
        this.updateInputLabels();
    }

    updateTranslations() {
        // Update elements with data-en and data-bn attributes
        document.querySelectorAll('[data-en][data-bn]').forEach(element => {
            const key = this.currentLanguage === 'en' ? 'data-en' : 'data-bn';
            const text = element.getAttribute(key);
            if (text) {
                if (element.tagName === 'INPUT' && element.type !== 'submit') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });

        // Update elements with translation keys
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
    }

    updateLanguageButtons() {
        const langButtons = document.querySelectorAll('#langToggle, #mobileLangToggle');
        langButtons.forEach(button => {
            if (button) {
                button.textContent = this.currentLanguage === 'en' ? 'বাংলা' : 'English';
                button.classList.toggle('active', this.currentLanguage === 'bn');
            }
        });
    }

    updatePlaceholders() {
        // Update input placeholders based on current language
        const placeholderMappings = {
            'searchInput': this.currentLanguage === 'en' ? 'Search products...' : 'পণ্য খুঁজুন...',
            'mobileSearchInput': this.currentLanguage === 'en' ? 'Search products...' : 'পণ্য খুঁজুন...',
            'customerName': this.currentLanguage === 'en' ? 'Customer Name' : 'গ্রাহকের নাম',
            'customerPhone': this.currentLanguage === 'en' ? 'Phone Number' : 'ফোন নম্বর',
            'billSearchInput': this.currentLanguage === 'en' ? 'Search bill by number' : 'বিল নম্বর দিয়ে খুঁজুন'
        };

        Object.entries(placeholderMappings).forEach(([id, placeholder]) => {
            const element = document.getElementById(id);
            if (element) {
                element.placeholder = placeholder;
            }
        });
    }

    updateInputLabels() {
        // Update floating labels for inputs
        document.querySelectorAll('.input-group label').forEach(label => {
            const input = label.previousElementSibling;
            if (input && input.hasAttribute('data-en') && input.hasAttribute('data-bn')) {
                const key = this.currentLanguage === 'en' ? 'data-en' : 'data-bn';
                const text = input.getAttribute(key);
                if (text) {
                    label.textContent = text;
                }
            }
        });
    }

    getTranslation(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    // Method to translate text programmatically
    translate(key) {
        return this.getTranslation(key);
    }

    // Method to format currency based on language
    formatCurrency(amount) {
        const formattedAmount = parseFloat(amount).toFixed(2);
        return this.currentLanguage === 'bn' ? `৳${formattedAmount}` : `৳${formattedAmount}`;
    }

    // Method to format date based on language
    formatDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        if (this.currentLanguage === 'bn') {
            return new Intl.DateTimeFormat('bn-BD', options).format(date);
        } else {
            return new Intl.DateTimeFormat('en-US', options).format(date);
        }
    }

    // Method to get number in local format
    formatNumber(number) {
        if (this.currentLanguage === 'bn') {
            return number.toLocaleString('bn-BD');
        } else {
            return number.toLocaleString('en-US');
        }
    }

    // Method to get current language direction (for future RTL support)
    getDirection() {
        return 'ltr'; // Both English and Bengali are LTR
    }

    // Method to add new translations dynamically
    addTranslations(lang, translations) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        Object.assign(this.translations[lang], translations);
    }

    // Method to get all available languages
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }

    // Method to check if a language is supported
    isLanguageSupported(lang) {
        return this.translations.hasOwnProperty(lang);
    }
}

// Initialize language system
document.addEventListener('DOMContentLoaded', () => {
    window.languageSystem = new LanguageSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSystem;
}