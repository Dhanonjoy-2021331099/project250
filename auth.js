// Authentication System
class AuthSystem {
    constructor() {
        this.currentForm = 'signIn';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedLanguage();
        this.initializeDefaultUsers();
    }

    initializeDefaultUsers() {
        // Create default users if they don't exist
        const users = this.getUsers();
        if (users.length === 0) {
            const defaultUsers = [
                {
                    id: 'user1',
                    name: 'John Doe',
                    email: 'admin@hotel.com',
                    phone: '+880 1234567890',
                    password: this.hashPassword('admin123'),
                    role: 'manager',
                    joinDate: new Date().toISOString(),
                    profileImage: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
                },
                {
                    id: 'user2',
                    name: 'Jane Smith',
                    email: 'staff@hotel.com',
                    phone: '+880 1234567891',
                    password: this.hashPassword('staff123'),
                    role: 'staff',
                    joinDate: new Date().toISOString(),
                    profileImage: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
                }
            ];
            localStorage.setItem('hotel_users', JSON.stringify(defaultUsers));
        }
    }

    bindEvents() {
        // Form switching
        document.getElementById('showSignUp')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('signUp');
        });

        document.getElementById('showSignIn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('signIn');
        });

        document.getElementById('showForgotPassword')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('forgotPassword');
        });

        document.getElementById('backToSignIn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('signIn');
        });

        // Form submissions
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });

        document.getElementById('resetForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePasswordReset(e);
        });

        // Password strength checker
        document.getElementById('registerPassword')?.addEventListener('input', (e) => {
            this.checkPasswordStrength(e.target.value);
        });

        // Confirm password validation
        document.getElementById('confirmPassword')?.addEventListener('input', (e) => {
            this.validatePasswordMatch();
        });
    }

    switchForm(formType) {
        // Hide all forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });

        // Show selected form
        document.getElementById(`${formType}Form`).classList.add('active');
        this.currentForm = formType;

        // Clear any error messages
        this.clearErrors();
    }

    async handleLogin(e) {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        if (!this.validateEmail(email)) {
            this.showError('loginEmail', 'Please enter a valid email address');
            return;
        }

        if (!password) {
            this.showError('loginPassword', 'Password is required');
            return;
        }

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API delay
            await this.delay(1000);

            const users = this.getUsers();
            const user = users.find(u => u.email === email && u.password === this.hashPassword(password));

            if (user) {
                // Store current user session
                localStorage.setItem('hotel_current_user', JSON.stringify(user));
                
                this.showSuccess('Login successful! Redirecting...');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                this.showError('loginPassword', 'Invalid email or password');
            }
        } catch (error) {
            this.showError('loginPassword', 'Login failed. Please try again.');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleRegister(e) {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        // Validation
        if (!name.trim()) {
            this.showError('registerName', 'Name is required');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showError('registerEmail', 'Please enter a valid email address');
            return;
        }

        if (!this.validatePhone(phone)) {
            this.showError('registerPhone', 'Please enter a valid phone number');
            return;
        }

        if (!this.isPasswordStrong(password)) {
            this.showError('registerPassword', 'Password must be at least 8 characters with uppercase, lowercase, number and special character');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('confirmPassword', 'Passwords do not match');
            return;
        }

        // Check if user already exists
        const users = this.getUsers();
        if (users.find(u => u.email === email)) {
            this.showError('registerEmail', 'User with this email already exists');
            return;
        }

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API delay
            await this.delay(1500);

            // Create new user
            const newUser = {
                id: 'user_' + Date.now(),
                name: name.trim(),
                email: email.toLowerCase(),
                phone: phone,
                password: this.hashPassword(password),
                role: 'staff',
                joinDate: new Date().toISOString(),
                profileImage: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
            };

            users.push(newUser);
            localStorage.setItem('hotel_users', JSON.stringify(users));

            this.showSuccess('Account created successfully! Please sign in.');
            
            // Switch to sign in form
            setTimeout(() => {
                this.switchForm('signIn');
                document.getElementById('loginEmail').value = email;
            }, 2000);

        } catch (error) {
            this.showError('registerPassword', 'Registration failed. Please try again.');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handlePasswordReset(e) {
        const email = document.getElementById('resetEmail').value;
        const submitBtn = e.target.querySelector('button[type="submit"]');

        if (!this.validateEmail(email)) {
            this.showError('resetEmail', 'Please enter a valid email address');
            return;
        }

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            // Simulate API delay
            await this.delay(2000);

            const users = this.getUsers();
            const user = users.find(u => u.email === email);

            if (user) {
                this.showSuccess('Password reset link sent to your email!');
                setTimeout(() => {
                    this.switchForm('signIn');
                }, 2000);
            } else {
                this.showError('resetEmail', 'No account found with this email address');
            }
        } catch (error) {
            this.showError('resetEmail', 'Failed to send reset link. Please try again.');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    }

    checkPasswordStrength(password) {
        const strengthIndicator = document.getElementById('passwordStrength');
        if (!strengthIndicator) return;

        const strength = this.getPasswordStrength(password);
        
        strengthIndicator.className = `password-strength ${strength}`;
        
        if (password.length === 0) {
            strengthIndicator.className = 'password-strength';
        }
    }

    getPasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        if (score < 3) return 'weak';
        if (score < 5) return 'medium';
        return 'strong';
    }

    isPasswordStrong(password) {
        return password.length >= 8 &&
               /[a-z]/.test(password) &&
               /[A-Z]/.test(password) &&
               /[0-9]/.test(password) &&
               /[^A-Za-z0-9]/.test(password);
    }

    validatePasswordMatch() {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showError('confirmPassword', 'Passwords do not match');
        } else {
            this.clearError('confirmPassword');
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    hashPassword(password) {
        // Simple hash function for demo purposes
        // In production, use proper hashing like bcrypt
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('hotel_users') || '[]');
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const inputGroup = field.closest('.input-group');
        
        inputGroup.classList.add('error');
        inputGroup.classList.remove('success');
        
        // Remove existing error message
        const existingError = inputGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        inputGroup.appendChild(errorElement);
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const inputGroup = field.closest('.input-group');
        
        inputGroup.classList.remove('error');
        
        const errorMessage = inputGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    clearErrors() {
        document.querySelectorAll('.input-group').forEach(group => {
            group.classList.remove('error', 'success');
        });
        
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
    }

    setButtonLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    loadSavedLanguage() {
        const savedLang = localStorage.getItem('hotel_language') || 'en';
        if (window.languageSystem) {
            window.languageSystem.setLanguage(savedLang);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize authentication system
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});