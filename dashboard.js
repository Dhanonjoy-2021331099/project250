// Dashboard System
class DashboardSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.checkAuthentication();
        this.bindEvents();
        this.updateUserProfile();
        this.initializeMobileMenu();
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('hotel_current_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    checkAuthentication() {
        if (!this.currentUser) {
            // Redirect to login if not authenticated
            window.location.href = 'index.html';
            return;
        }
    }

    bindEvents() {
        // Logout functionality
        const logoutButtons = ['logoutBtn', 'mobileLogoutBtn'];
        logoutButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.logout();
                });
            }
        });

        // Profile editing
        document.getElementById('editProfileBtn')?.addEventListener('click', () => {
            this.toggleProfileEdit();
        });

        // Profile image change
        document.getElementById('changePhotoBtn')?.addEventListener('click', () => {
            document.getElementById('profileImageInput')?.click();
        });

        document.getElementById('profileImageInput')?.addEventListener('change', (e) => {
            this.handleProfileImageChange(e);
        });

        // Manager access
        document.getElementById('managerAccessBtn')?.addEventListener('click', () => {
            this.accessManagerPanel();
        });

        // Mobile menu toggle
        document.getElementById('mobileMenuToggle')?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Theme and language toggles for mobile
        document.getElementById('mobileThemeToggle')?.addEventListener('click', () => {
            if (window.themeSystem) {
                window.themeSystem.toggleTheme();
            }
        });

        document.getElementById('mobileLangToggle')?.addEventListener('click', () => {
            if (window.languageSystem) {
                window.languageSystem.toggleLanguage();
            }
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Profile section visibility toggle
        this.setupProfileToggle();
    }

    updateUserProfile() {
        if (!this.currentUser) return;

        // Update profile information
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profilePhone = document.getElementById('profilePhone');
        const profileRole = document.getElementById('profileRole');
        const profileJoined = document.getElementById('profileJoined');
        const profileImage = document.getElementById('profileImage');

        if (profileName) profileName.textContent = this.currentUser.name;
        if (profileEmail) profileEmail.textContent = this.currentUser.email;
        if (profilePhone) profilePhone.textContent = this.currentUser.phone;
        if (profileRole) {
            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const roleText = this.currentUser.role === 'manager' ? 
                (currentLang === 'bn' ? 'ম্যানেজার' : 'Manager') : 
                (currentLang === 'bn' ? 'কর্মচারী' : 'Staff');
            profileRole.textContent = roleText;
        }
        if (profileJoined) {
            const joinDate = new Date(this.currentUser.joinDate);
            const formattedDate = window.languageSystem ? 
                window.languageSystem.formatDate(joinDate) : 
                joinDate.toLocaleDateString();
            profileJoined.textContent = formattedDate;
        }
        if (profileImage && this.currentUser.profileImage) {
            profileImage.src = this.currentUser.profileImage;
        }
    }

    toggleProfileEdit() {
        const profileDetails = document.getElementById('profileDetails');
        const editBtn = document.getElementById('editProfileBtn');
        
        if (!profileDetails || !editBtn) return;

        const isEditing = editBtn.textContent.includes('Save') || editBtn.textContent.includes('সংরক্ষণ');
        
        if (isEditing) {
            this.saveProfileChanges();
        } else {
            this.enableProfileEdit();
        }
    }

    enableProfileEdit() {
        const profileDetails = document.getElementById('profileDetails');
        const editBtn = document.getElementById('editProfileBtn');
        
        if (!profileDetails || !editBtn) return;

        // Convert display elements to input fields
        const detailItems = profileDetails.querySelectorAll('.detail-item');
        detailItems.forEach(item => {
            const label = item.querySelector('label');
            const span = item.querySelector('span');
            
            if (label && span && !label.textContent.includes('Role') && !label.textContent.includes('Joined')) {
                const input = document.createElement('input');
                input.type = label.textContent.includes('Phone') ? 'tel' : 'text';
                input.value = span.textContent;
                input.className = 'profile-edit-input';
                
                span.style.display = 'none';
                item.appendChild(input);
            }
        });

        // Update button text
        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        editBtn.textContent = currentLang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes';
        editBtn.classList.add('save-mode');
    }

    saveProfileChanges() {
        const profileDetails = document.getElementById('profileDetails');
        const editBtn = document.getElementById('editProfileBtn');
        
        if (!profileDetails || !editBtn) return;

        // Get updated values
        const inputs = profileDetails.querySelectorAll('.profile-edit-input');
        const updates = {};

        inputs.forEach(input => {
            const item = input.closest('.detail-item');
            const label = item.querySelector('label');
            
            if (label.textContent.includes('Phone')) {
                updates.phone = input.value;
            }
            // Add more fields as needed
        });

        // Update user data
        Object.assign(this.currentUser, updates);
        this.saveUserData();

        // Restore display mode
        inputs.forEach(input => {
            const item = input.closest('.detail-item');
            const span = item.querySelector('span');
            
            span.textContent = input.value;
            span.style.display = '';
            input.remove();
        });

        // Update button text
        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        editBtn.textContent = currentLang === 'bn' ? 'প্রোফাইল সম্পাদনা' : 'Edit Profile';
        editBtn.classList.remove('save-mode');

        // Show success message
        const successMessage = currentLang === 'bn' ? 
            'প্রোফাইল আপডেট হয়েছে' : 
            'Profile updated successfully';
        this.showToast(successMessage, 'success');
    }

    handleProfileImageChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const message = currentLang === 'bn' ? 
                'অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন' : 
                'Please select an image file';
            this.showToast(message, 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const message = currentLang === 'bn' ? 
                'ছবির সাইজ ৫MB এর কম হতে হবে' : 
                'Image size must be less than 5MB';
            this.showToast(message, 'error');
            return;
        }

        // Read and display the image
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            const profileImage = document.getElementById('profileImage');
            
            if (profileImage) {
                profileImage.src = imageUrl;
                
                // Update user data
                this.currentUser.profileImage = imageUrl;
                this.saveUserData();
                
                const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
                const message = currentLang === 'bn' ? 
                    'প্রোফাইল ছবি আপডেট হয়েছে' : 
                    'Profile image updated';
                this.showToast(message, 'success');
            }
        };
        
        reader.readAsDataURL(file);
    }

    saveUserData() {
        // Update current user in localStorage
        localStorage.setItem('hotel_current_user', JSON.stringify(this.currentUser));
        
        // Update user in users list
        const users = JSON.parse(localStorage.getItem('hotel_users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            localStorage.setItem('hotel_users', JSON.stringify(users));
        }
    }

    logout() {
        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        const confirmMessage = currentLang === 'bn' ? 
            'আপনি কি নিশ্চিত যে লগআউট করতে চান?' : 
            'Are you sure you want to logout?';

        if (confirm(confirmMessage)) {
            // Clear current user session
            localStorage.removeItem('hotel_current_user');
            
            // Clear any temporary data
            localStorage.removeItem('hotel_current_cart');
            
            // Redirect to login page
            window.location.href = 'index.html';
        }
    }

    accessManagerPanel() {
        if (this.currentUser.role !== 'manager') {
            // Show manager password modal for staff users
            this.showManagerPasswordModal();
        } else {
            // Direct access for managers
            window.location.href = 'manager.html';
        }
    }

    showManagerPasswordModal() {
        // Create modal for manager password
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'managerPasswordModal';
        
        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${currentLang === 'bn' ? 'ম্যানেজার প্রমাণীকরণ' : 'Manager Authentication'}</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <form id="managerPasswordForm">
                    <div class="form-group">
                        <label>${currentLang === 'bn' ? 'ম্যানেজার পাসওয়ার্ড:' : 'Manager Password:'}</label>
                        <input type="password" id="managerPassword" required>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="save-btn">${currentLang === 'bn' ? 'প্যানেল অ্যাক্সেস' : 'Access Panel'}</button>
                        <button type="button" class="cancel-btn" onclick="this.closest('.modal').remove()">${currentLang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('managerPasswordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('managerPassword').value;
            
            // Check manager password (default: manager123)
            if (password === 'manager123') {
                modal.remove();
                window.location.href = 'manager.html';
            } else {
                const errorMessage = currentLang === 'bn' ? 
                    'ভুল পাসওয়ার্ড' : 
                    'Incorrect password';
                this.showToast(errorMessage, 'error');
            }
        });
    }

    initializeMobileMenu() {
        this.handleResize();
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuToggle = document.getElementById('mobileMenuToggle');
        
        if (mobileMenu && menuToggle) {
            mobileMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        }
    }

    handleResize() {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuToggle = document.getElementById('mobileMenuToggle');
        
        if (window.innerWidth > 768) {
            // Desktop view
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        }
    }

    setupProfileToggle() {
        // Add functionality to collapse/expand profile section on mobile
        const profileHeader = document.querySelector('.profile-header');
        const profileDetails = document.getElementById('profileDetails');
        
        if (profileHeader && profileDetails && window.innerWidth <= 768) {
            profileHeader.style.cursor = 'pointer';
            profileHeader.addEventListener('click', () => {
                profileDetails.classList.toggle('collapsed');
            });
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

    // Method to get user statistics
    getUserStats() {
        const stats = {
            loginTime: new Date().toISOString(),
            role: this.currentUser.role,
            name: this.currentUser.name,
            email: this.currentUser.email
        };
        
        return stats;
    }

    // Method to update user activity
    updateUserActivity() {
        if (this.currentUser) {
            this.currentUser.lastActivity = new Date().toISOString();
            this.saveUserData();
        }
    }

    // Method to check if user has specific permissions
    hasPermission(permission) {
        const permissions = {
            manager: ['view_products', 'edit_products', 'delete_products', 'view_bills', 'manage_users'],
            staff: ['view_products', 'create_bills', 'view_bills']
        };
        
        const userPermissions = permissions[this.currentUser.role] || [];
        return userPermissions.includes(permission);
    }
}

// Initialize dashboard system
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardSystem = new DashboardSystem();
    
    // Update user activity periodically
    setInterval(() => {
        if (window.dashboardSystem) {
            window.dashboardSystem.updateUserActivity();
        }
    }, 300000); // Every 5 minutes
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardSystem;
}