// Manager Panel System
class ManagerSystem {
    constructor() {
        this.currentUser = null;
        this.products = [];
        this.currentFilter = 'all';
        this.editingProductId = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.checkManagerAccess();
        this.loadProducts();
        this.bindEvents();
        this.displayProducts();
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('hotel_current_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    checkManagerAccess() {
        // Check if user is authenticated
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }

        // For demo purposes, allow access if user came from dashboard
        // In production, you'd want more robust access control
    }

    loadProducts() {
        if (window.productsSystem) {
            this.products = window.productsSystem.getAllProducts();
        } else {
            // Fallback: load from localStorage
            const savedProducts = localStorage.getItem('hotel_products');
            if (savedProducts) {
                this.products = JSON.parse(savedProducts);
            }
        }
    }

    bindEvents() {
        // Back to dashboard
        document.getElementById('backToDashboard')?.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });

        // Add product button
        document.getElementById('addProductBtn')?.addEventListener('click', () => {
            this.showProductModal();
        });

        // Category filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.setFilter(category);
            });
        });

        // Product form submission
        document.getElementById('productForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        // Modal close buttons
        document.getElementById('closeModal')?.addEventListener('click', () => {
            this.hideProductModal();
        });

        document.getElementById('cancelBtn')?.addEventListener('click', () => {
            this.hideProductModal();
        });

        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideProductModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideProductModal();
            }
        });
    }

    setFilter(category) {
        this.currentFilter = category;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Display filtered products
        this.displayProducts();
    }

    displayProducts() {
        const tableBody = document.getElementById('productsTableBody');
        if (!tableBody) return;

        // Filter products
        let filteredProducts = this.currentFilter === 'all' ? 
            this.products : 
            this.products.filter(p => p.category === this.currentFilter);

        // Clear table
        tableBody.innerHTML = '';

        if (filteredProducts.length === 0) {
            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const emptyMessage = currentLang === 'bn' ? 'কোন পণ্য পাওয়া যায়নি' : 'No products found';
            
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center" style="padding: 2rem; color: var(--text-secondary);">
                        ${emptyMessage}
                    </td>
                </tr>
            `;
            return;
        }

        // Create table rows
        filteredProducts.forEach(product => {
            const row = this.createProductRow(product);
            tableBody.appendChild(row);
        });
    }

    createProductRow(product) {
        const row = document.createElement('tr');
        row.setAttribute('data-product-id', product.id);

        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        const productName = currentLang === 'bn' && product.namebn ? product.namebn : product.name;
        const categoryName = this.getCategoryDisplayName(product.category);

        row.innerHTML = `
            <td class="product-image-cell">
                <img src="${product.image}" alt="${productName}" onerror="this.src='https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop'">
            </td>
            <td class="product-name-cell">${productName}</td>
            <td class="product-category-cell">${categoryName}</td>
            <td class="product-price-cell">৳${product.price.toFixed(2)}</td>
            <td class="product-actions">
                <button class="edit-btn" onclick="window.managerSystem.editProduct('${product.id}')">
                    ${currentLang === 'bn' ? 'সম্পাদনা' : 'Edit'}
                </button>
                <button class="delete-btn" onclick="window.managerSystem.deleteProduct('${product.id}')">
                    ${currentLang === 'bn' ? 'মুছুন' : 'Delete'}
                </button>
            </td>
        `;

        return row;
    }

    getCategoryDisplayName(category) {
        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        const categoryNames = {
            breakfast: currentLang === 'bn' ? 'নাস্তা' : 'Breakfast',
            lunch: currentLang === 'bn' ? 'দুপুরের খাবার' : 'Lunch',
            dinner: currentLang === 'bn' ? 'রাতের খাবার' : 'Dinner',
            snacks: currentLang === 'bn' ? 'নাস্তা' : 'Snacks',
            beverages: currentLang === 'bn' ? 'পানীয়' : 'Beverages'
        };
        
        return categoryNames[category] || category;
    }

    showProductModal(productId = null) {
        const modal = document.getElementById('productModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('productForm');
        
        if (!modal || !modalTitle || !form) return;

        this.editingProductId = productId;
        
        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        
        if (productId) {
            // Edit mode
            const product = this.products.find(p => p.id === productId);
            if (product) {
                modalTitle.textContent = currentLang === 'bn' ? 'পণ্য সম্পাদনা করুন' : 'Edit Product';
                this.populateForm(product);
            }
        } else {
            // Add mode
            modalTitle.textContent = currentLang === 'bn' ? 'নতুন পণ্য যোগ করুন' : 'Add New Product';
            form.reset();
        }
        
        modal.classList.add('active');
        
        // Focus first input
        const firstInput = form.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    hideProductModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.remove('active');
            this.editingProductId = null;
        }
    }

    populateForm(product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productImage').value = product.image || '';
    }

    async saveProduct() {
        const form = document.getElementById('productForm');
        const saveBtn = form.querySelector('.save-btn');
        
        // Get form data
        const productData = {
            name: document.getElementById('productName').value.trim(),
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            image: document.getElementById('productImage').value.trim()
        };

        // Validation
        if (!productData.name) {
            this.showError('productName', 'Product name is required');
            return;
        }

        if (!productData.category) {
            this.showError('productCategory', 'Category is required');
            return;
        }

        if (isNaN(productData.price) || productData.price <= 0) {
            this.showError('productPrice', 'Valid price is required');
            return;
        }

        // Set default image if not provided
        if (!productData.image) {
            productData.image = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop';
        }

        // Show loading state
        this.setButtonLoading(saveBtn, true);

        try {
            // Simulate API delay
            await this.delay(1000);

            if (this.editingProductId) {
                // Update existing product
                this.updateProduct(this.editingProductId, productData);
            } else {
                // Add new product
                this.addProduct(productData);
            }

            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const successMessage = this.editingProductId ? 
                (currentLang === 'bn' ? 'পণ্য আপডেট হয়েছে' : 'Product updated successfully') :
                (currentLang === 'bn' ? 'পণ্য যোগ করা হয়েছে' : 'Product added successfully');
            
            this.showToast(successMessage, 'success');
            this.hideProductModal();
            this.displayProducts();

        } catch (error) {
            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const errorMessage = currentLang === 'bn' ? 
                'পণ্য সংরক্ষণ করতে ব্যর্থ' : 
                'Failed to save product';
            this.showToast(errorMessage, 'error');
        } finally {
            this.setButtonLoading(saveBtn, false);
        }
    }

    addProduct(productData) {
        const newProduct = {
            id: 'product_' + Date.now(),
            ...productData
        };
        
        this.products.push(newProduct);
        this.saveProducts();
        
        // Update products system if available
        if (window.productsSystem) {
            window.productsSystem.products = this.products;
            window.productsSystem.saveProducts();
        }
    }

    updateProduct(productId, productData) {
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...productData };
            this.saveProducts();
            
            // Update products system if available
            if (window.productsSystem) {
                window.productsSystem.products = this.products;
                window.productsSystem.saveProducts();
            }
        }
    }

    editProduct(productId) {
        this.showProductModal(productId);
    }

    deleteProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        const productName = currentLang === 'bn' && product.namebn ? product.namebn : product.name;
        const confirmMessage = currentLang === 'bn' ? 
            `আপনি কি নিশ্চিত যে "${productName}" মুছে ফেলতে চান?` : 
            `Are you sure you want to delete "${productName}"?`;

        if (confirm(confirmMessage)) {
            const index = this.products.findIndex(p => p.id === productId);
            if (index !== -1) {
                this.products.splice(index, 1);
                this.saveProducts();
                
                // Update products system if available
                if (window.productsSystem) {
                    window.productsSystem.products = this.products;
                    window.productsSystem.saveProducts();
                }
                
                this.displayProducts();
                
                const successMessage = currentLang === 'bn' ? 
                    'পণ্য মুছে ফেলা হয়েছে' : 
                    'Product deleted successfully';
                this.showToast(successMessage, 'success');
            }
        }
    }

    saveProducts() {
        localStorage.setItem('hotel_products', JSON.stringify(this.products));
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.add('error');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
        
        // Focus the field
        field.focus();
    }

    clearErrors() {
        document.querySelectorAll('.form-group').forEach(group => {
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
            button.style.position = 'relative';
            button.style.color = 'transparent';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.style.position = '';
            button.style.color = '';
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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Method to export products as CSV
    exportProductsCSV() {
        const headers = ['ID', 'Name', 'Category', 'Price', 'Image URL'];
        const csvContent = [
            headers.join(','),
            ...this.products.map(product => [
                product.id,
                `"${product.name}"`,
                product.category,
                product.price,
                `"${product.image}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hotel_products.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    // Method to import products from CSV
    importProductsCSV(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const lines = csv.split('\n');
                const headers = lines[0].split(',');
                
                const importedProducts = [];
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim()) {
                        const values = lines[i].split(',');
                        const product = {
                            id: values[0],
                            name: values[1].replace(/"/g, ''),
                            category: values[2],
                            price: parseFloat(values[3]),
                            image: values[4].replace(/"/g, '')
                        };
                        importedProducts.push(product);
                    }
                }
                
                this.products = importedProducts;
                this.saveProducts();
                this.displayProducts();
                
                const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
                const message = currentLang === 'bn' ? 
                    'পণ্য সফলভাবে আমদানি করা হয়েছে' : 
                    'Products imported successfully';
                this.showToast(message, 'success');
                
            } catch (error) {
                const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
                const message = currentLang === 'bn' ? 
                    'পণ্য আমদানি করতে ব্যর্থ' : 
                    'Failed to import products';
                this.showToast(message, 'error');
            }
        };
        reader.readAsText(file);
    }

    // Method to get product statistics
    getProductStatistics() {
        const stats = {
            total: this.products.length,
            byCategory: {},
            priceRange: {
                min: Math.min(...this.products.map(p => p.price)),
                max: Math.max(...this.products.map(p => p.price)),
                average: this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length
            }
        };

        this.products.forEach(product => {
            if (!stats.byCategory[product.category]) {
                stats.byCategory[product.category] = 0;
            }
            stats.byCategory[product.category]++;
        });

        return stats;
    }

    // Method to bulk update prices
    bulkUpdatePrices(percentage, operation = 'increase') {
        const multiplier = operation === 'increase' ? (1 + percentage / 100) : (1 - percentage / 100);
        
        this.products.forEach(product => {
            product.price = Math.round(product.price * multiplier * 100) / 100;
        });
        
        this.saveProducts();
        this.displayProducts();
        
        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        const message = currentLang === 'bn' ? 
            'সব পণ্যের দাম আপডেট হয়েছে' : 
            'All product prices updated';
        this.showToast(message, 'success');
    }
}

// Initialize manager system
document.addEventListener('DOMContentLoaded', () => {
    window.managerSystem = new ManagerSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ManagerSystem;
}