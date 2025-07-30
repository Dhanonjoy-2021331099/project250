// Products Management System
class ProductsSystem {
    constructor() {
        this.products = [];
        this.currentCategory = 'breakfast';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.loadProducts();
        this.bindEvents();
        this.displayProducts();
    }

    loadProducts() {
        // Load products from localStorage or initialize with default products
        const savedProducts = localStorage.getItem('hotel_products');
        if (savedProducts) {
            this.products = JSON.parse(savedProducts);
        } else {
            this.initializeDefaultProducts();
        }
    }

    initializeDefaultProducts() {
        this.products = [
            // Breakfast Items
            {
                id: 'breakfast_1',
                name: 'Paratha with Egg',
                namebn: 'ডিম পরোটা',
                category: 'breakfast',
                price: 80,
                image: 'https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'breakfast_2',
                name: 'Bread Toast',
                namebn: 'টোস্ট',
                category: 'breakfast',
                price: 50,
                image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'breakfast_3',
                name: 'Pancakes',
                namebn: 'প্যানকেক',
                category: 'breakfast',
                price: 120,
                image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'breakfast_4',
                name: 'Omelette',
                namebn: 'অমলেট',
                category: 'breakfast',
                price: 70,
                image: 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },

            // Lunch Items
            {
                id: 'lunch_1',
                name: 'Chicken Biryani',
                namebn: 'চিকেন বিরিয়ানি',
                category: 'lunch',
                price: 250,
                image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'lunch_2',
                name: 'Beef Curry',
                namebn: 'গরুর মাংস',
                category: 'lunch',
                price: 200,
                image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'lunch_3',
                name: 'Fish Curry',
                namebn: 'মাছের তরকারি',
                category: 'lunch',
                price: 180,
                image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'lunch_4',
                name: 'Vegetable Curry',
                namebn: 'সবজি তরকারি',
                category: 'lunch',
                price: 120,
                image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },

            // Dinner Items
            {
                id: 'dinner_1',
                name: 'Grilled Chicken',
                namebn: 'গ্রিল চিকেন',
                category: 'dinner',
                price: 300,
                image: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'dinner_2',
                name: 'Mutton Curry',
                namebn: 'খাসির মাংস',
                category: 'dinner',
                price: 350,
                image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'dinner_3',
                name: 'Fried Rice',
                namebn: 'ভাজা ভাত',
                category: 'dinner',
                price: 150,
                image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'dinner_4',
                name: 'Noodles',
                namebn: 'নুডলস',
                category: 'dinner',
                price: 130,
                image: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },

            // Snacks Items
            {
                id: 'snacks_1',
                name: 'Samosa',
                namebn: 'সমুচা',
                category: 'snacks',
                price: 25,
                image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'snacks_2',
                name: 'French Fries',
                namebn: 'ফ্রেঞ্চ ফ্রাই',
                category: 'snacks',
                price: 80,
                image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'snacks_3',
                name: 'Chicken Roll',
                namebn: 'চিকেন রোল',
                category: 'snacks',
                price: 100,
                image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'snacks_4',
                name: 'Sandwich',
                namebn: 'স্যান্ডউইচ',
                category: 'snacks',
                price: 90,
                image: 'https://images.pexels.com/photos/1603901/pexels-photo-1603901.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },

            // Beverages Items
            {
                id: 'beverages_1',
                name: 'Coca-Cola',
                namebn: 'কোকা-কোলা',
                category: 'beverages',
                price: 30,
                image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'beverages_2',
                name: 'Sprite',
                namebn: 'স্প্রাইট',
                category: 'beverages',
                price: 30,
                image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'beverages_3',
                name: '7up',
                namebn: '৭আপ',
                category: 'beverages',
                price: 30,
                image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'beverages_4',
                name: 'Mojo',
                namebn: 'মজো',
                category: 'beverages',
                price: 35,
                image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'beverages_5',
                name: 'Orange Juice',
                namebn: 'কমলার রস',
                category: 'beverages',
                price: 60,
                image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'beverages_6',
                name: 'Mineral Water',
                namebn: 'মিনারেল ওয়াটার',
                category: 'beverages',
                price: 20,
                image: 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'beverages_7',
                name: 'Tea',
                namebn: 'চা',
                category: 'beverages',
                price: 15,
                image: 'https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            },
            {
                id: 'beverages_8',
                name: 'Coffee',
                namebn: 'কফি',
                category: 'beverages',
                price: 25,
                image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
            }
        ];

        this.saveProducts();
    }

    bindEvents() {
        // Category navigation
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.setCategory(category);
            });
        });

        // Search functionality
        const searchInputs = ['searchInput', 'mobileSearchInput'];
        searchInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.setSearchQuery(e.target.value);
                });
            }
        });

        // Search buttons
        const searchButtons = ['searchBtn', 'mobileSearchBtn'];
        searchButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.performSearch();
                });
            }
        });

        // Product card interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = e.target.getAttribute('data-product-id');
                this.addToCart(productId);
            }
        });

        // Product card hover effects
        document.addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('product-card')) {
                e.target.classList.add('zoom');
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.classList.contains('product-card')) {
                e.target.classList.remove('zoom');
            }
        }, true);
    }

    setCategory(category) {
        this.currentCategory = category;
        
        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Display products for selected category
        this.displayProducts();
    }

    setSearchQuery(query) {
        this.searchQuery = query.toLowerCase().trim();
        this.displayProducts();
    }

    performSearch() {
        // Trigger search with current query
        this.displayProducts();
    }

    displayProducts() {
        const container = document.getElementById('productsContainer');
        if (!container) return;

        // Filter products based on category and search query
        let filteredProducts = this.products.filter(product => {
            const matchesCategory = product.category === this.currentCategory;
            const matchesSearch = this.searchQuery === '' || 
                                product.name.toLowerCase().includes(this.searchQuery) ||
                                (product.namebn && product.namebn.includes(this.searchQuery));
            
            return matchesCategory && matchesSearch;
        });

        // Clear container
        container.innerHTML = '';

        if (filteredProducts.length === 0) {
            container.innerHTML = `
                <div class="empty-products">
                    <div class="empty-products-icon">🍽️</div>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or browse other categories.</p>
                </div>
            `;
            return;
        }

        // Create product cards
        filteredProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            container.appendChild(productCard);
        });

        // Add animation
        container.classList.add('fade-in');
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);

        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        const productName = currentLang === 'bn' && product.namebn ? product.namebn : product.name;
        const formattedPrice = window.languageSystem ? 
            window.languageSystem.formatCurrency(product.price) : 
            `৳${product.price.toFixed(2)}`;

        card.innerHTML = `
            <img src="${product.image}" alt="${productName}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${productName}</h3>
                <div class="product-price">${formattedPrice}</div>
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    ${currentLang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                </button>
            </div>
        `;

        // Add click event for product details (zoom effect)
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart-btn')) {
                this.showProductDetails(product);
            }
        });

        return card;
    }

    showProductDetails(product) {
        // Create a modal or expanded view for product details
        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        const productName = currentLang === 'bn' && product.namebn ? product.namebn : product.name;
        
        // For now, just show an alert with product details
        // In a full implementation, you'd create a proper modal
        const details = `
            Product: ${productName}
            Price: ৳${product.price}
            Category: ${product.category}
        `;
        
        console.log('Product Details:', details);
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Trigger billing system to add product
        if (window.billingSystem) {
            window.billingSystem.addItem(product);
            
            // Show success feedback
            this.showAddToCartFeedback(product);
        }
    }

    showAddToCartFeedback(product) {
        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        const productName = currentLang === 'bn' && product.namebn ? product.namebn : product.name;
        const message = currentLang === 'bn' ? 
            `${productName} কার্টে যোগ করা হয়েছে` : 
            `${productName} added to cart`;

        // Show toast notification
        this.showToast(message, 'success');

        // Add visual feedback to button
        const button = document.querySelector(`[data-product-id="${product.id}"]`);
        if (button) {
            button.classList.add('success');
            button.textContent = currentLang === 'bn' ? 'যোগ করা হয়েছে!' : 'Added!';
            
            setTimeout(() => {
                button.classList.remove('success');
                button.textContent = currentLang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart';
            }, 2000);
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Methods for manager panel
    getAllProducts() {
        return this.products;
    }

    addProduct(productData) {
        const newProduct = {
            id: 'product_' + Date.now(),
            ...productData
        };
        
        this.products.push(newProduct);
        this.saveProducts();
        
        // Refresh display if current category matches
        if (this.currentCategory === newProduct.category) {
            this.displayProducts();
        }
        
        return newProduct;
    }

    updateProduct(productId, productData) {
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...productData };
            this.saveProducts();
            
            // Refresh display
            this.displayProducts();
            
            return this.products[index];
        }
        return null;
    }

    deleteProduct(productId) {
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1)[0];
            this.saveProducts();
            
            // Refresh display
            this.displayProducts();
            
            return deletedProduct;
        }
        return null;
    }

    getProductById(productId) {
        return this.products.find(p => p.id === productId);
    }

    getProductsByCategory(category) {
        return this.products.filter(p => p.category === category);
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase().trim();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            (product.namebn && product.namebn.includes(searchTerm)) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }

    saveProducts() {
        localStorage.setItem('hotel_products', JSON.stringify(this.products));
    }

    // Method to export products data
    exportProducts() {
        return JSON.stringify(this.products, null, 2);
    }

    // Method to import products data
    importProducts(productsData) {
        try {
            const products = JSON.parse(productsData);
            if (Array.isArray(products)) {
                this.products = products;
                this.saveProducts();
                this.displayProducts();
                return true;
            }
        } catch (error) {
            console.error('Error importing products:', error);
        }
        return false;
    }

    // Method to get product statistics
    getProductStats() {
        const stats = {
            total: this.products.length,
            byCategory: {}
        };

        this.products.forEach(product => {
            if (!stats.byCategory[product.category]) {
                stats.byCategory[product.category] = 0;
            }
            stats.byCategory[product.category]++;
        });

        return stats;
    }
}

// Initialize products system
document.addEventListener('DOMContentLoaded', () => {
    window.productsSystem = new ProductsSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductsSystem;
}