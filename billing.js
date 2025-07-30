// Billing System
class BillingSystem {
    constructor() {
        this.cart = [];
        this.currentBillNumber = '';
        this.taxRate = 0.05; // 5% tax
        this.billHistory = [];
        this.init();
    }

    init() {
        this.generateBillNumber();
        this.loadBillHistory();
        this.bindEvents();
        this.updateDateTime();
        this.updateDisplay();
        
        // Update date/time every minute
        setInterval(() => this.updateDateTime(), 60000);
    }

    bindEvents() {
        // Generate bill button
        document.getElementById('generateBillBtn')?.addEventListener('click', () => {
            this.generateBill();
        });

        // Clear cart button
        document.getElementById('clearCartBtn')?.addEventListener('click', () => {
            this.clearCart();
        });

        // Print bill button
        document.getElementById('printBillBtn')?.addEventListener('click', () => {
            this.printBill();
        });

        // Bill search
        document.getElementById('searchBillBtn')?.addEventListener('click', () => {
            this.searchBill();
        });

        // Bill search input enter key
        document.getElementById('billSearchInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchBill();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'g':
                        e.preventDefault();
                        this.generateBill();
                        break;
                    case 'c':
                        e.preventDefault();
                        this.clearCart();
                        break;
                    case 'p':
                        e.preventDefault();
                        this.printBill();
                        break;
                }
            }
        });

        // Customer info change events
        document.getElementById('customerName')?.addEventListener('input', () => {
            this.updateCustomerInfo();
        });

        document.getElementById('customerPhone')?.addEventListener('input', () => {
            this.updateCustomerInfo();
        });
    }

    generateBillNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.currentBillNumber = `HTL${timestamp.toString().slice(-6)}${random}`;
        
        const billNumberElement = document.getElementById('billNumber');
        if (billNumberElement) {
            billNumberElement.textContent = this.currentBillNumber;
        }
    }

    updateDateTime() {
        const now = new Date();
        const dateTimeElement = document.getElementById('billingDateTime');
        
        if (dateTimeElement) {
            const formattedDateTime = window.languageSystem ? 
                window.languageSystem.formatDate(now) : 
                now.toLocaleString();
            dateTimeElement.textContent = formattedDateTime;
        }
    }

    addItem(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                namebn: product.namebn,
                price: product.price,
                quantity: quantity,
                image: product.image,
                category: product.category
            });
        }
        
        this.updateDisplay();
        this.saveCartToStorage();
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateDisplay();
        this.saveCartToStorage();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.updateDisplay();
                this.saveCartToStorage();
            }
        }
    }

    clearCart() {
        if (this.cart.length === 0) {
            this.showToast('Cart is already empty', 'info');
            return;
        }

        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        const confirmMessage = currentLang === 'bn' ? 
            'আপনি কি নিশ্চিত যে কার্ট পরিষ্কার করতে চান?' : 
            'Are you sure you want to clear the cart?';

        if (confirm(confirmMessage)) {
            this.cart = [];
            this.updateDisplay();
            this.saveCartToStorage();
            
            const successMessage = currentLang === 'bn' ? 
                'কার্ট পরিষ্কার করা হয়েছে' : 
                'Cart cleared successfully';
            this.showToast(successMessage, 'success');
        }
    }

    updateDisplay() {
        this.updateCartItems();
        this.updateBillSummary();
    }

    updateCartItems() {
        const cartContainer = document.getElementById('cartItems');
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const emptyMessage = currentLang === 'bn' ? 'কার্টে কোন আইটেম নেই' : 'No items in cart';
            
            cartContainer.innerHTML = `<div class="empty-cart">${emptyMessage}</div>`;
            cartContainer.classList.add('empty');
            return;
        }

        cartContainer.classList.remove('empty');
        cartContainer.innerHTML = '';

        this.cart.forEach(item => {
            const cartItem = this.createCartItemElement(item);
            cartContainer.appendChild(cartItem);
        });
    }

    createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-item-id', item.id);

        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        const itemName = currentLang === 'bn' && item.namebn ? item.namebn : item.name;
        const formattedPrice = window.languageSystem ? 
            window.languageSystem.formatCurrency(item.price) : 
            `৳${item.price.toFixed(2)}`;

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${itemName}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${itemName}</div>
                <div class="cart-item-price">${formattedPrice}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="window.billingSystem.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="window.billingSystem.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                <button class="remove-item-btn" onclick="window.billingSystem.removeItem('${item.id}')" title="Remove item">×</button>
            </div>
        `;

        // Add animation
        cartItem.classList.add('adding');
        setTimeout(() => cartItem.classList.remove('adding'), 300);

        return cartItem;
    }

    updateBillSummary() {
        const subtotal = this.calculateSubtotal();
        const tax = this.calculateTax(subtotal);
        const total = subtotal + tax;

        const formatCurrency = (amount) => {
            return window.languageSystem ? 
                window.languageSystem.formatCurrency(amount) : 
                `৳${amount.toFixed(2)}`;
        };

        // Update summary elements
        const subtotalElement = document.getElementById('subtotal');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');

        if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
        if (taxElement) taxElement.textContent = formatCurrency(tax);
        if (totalElement) totalElement.textContent = formatCurrency(total);
    }

    calculateSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    calculateTax(subtotal) {
        return subtotal * this.taxRate;
    }

    calculateTotal() {
        const subtotal = this.calculateSubtotal();
        return subtotal + this.calculateTax(subtotal);
    }

    async generateBill() {
        if (this.cart.length === 0) {
            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const message = currentLang === 'bn' ? 
                'কার্টে কোন আইটেম নেই' : 
                'No items in cart to generate bill';
            this.showToast(message, 'warning');
            return;
        }

        const customerName = document.getElementById('customerName')?.value.trim();
        const customerPhone = document.getElementById('customerPhone')?.value.trim();

        if (!customerName || !customerPhone) {
            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const message = currentLang === 'bn' ? 
                'গ্রাহকের নাম এবং ফোন নম্বর প্রয়োজন' : 
                'Customer name and phone number are required';
            this.showToast(message, 'error');
            return;
        }

        const generateBtn = document.getElementById('generateBillBtn');
        if (generateBtn) {
            generateBtn.classList.add('processing');
        }

        try {
            // Simulate processing time
            await this.delay(1500);

            const bill = this.createBill(customerName, customerPhone);
            this.saveBillToHistory(bill);
            
            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const successMessage = currentLang === 'bn' ? 
                `বিল সফলভাবে তৈরি হয়েছে! বিল নম্বর: ${bill.billNumber}` : 
                `Bill generated successfully! Bill Number: ${bill.billNumber}`;
            
            this.showToast(successMessage, 'success');
            
            // Reset for next order
            this.resetForNewOrder();
            
        } catch (error) {
            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const errorMessage = currentLang === 'bn' ? 
                'বিল তৈরি করতে ব্যর্থ হয়েছে' : 
                'Failed to generate bill';
            this.showToast(errorMessage, 'error');
        } finally {
            if (generateBtn) {
                generateBtn.classList.remove('processing');
            }
        }
    }

    createBill(customerName, customerPhone) {
        const now = new Date();
        const subtotal = this.calculateSubtotal();
        const tax = this.calculateTax(subtotal);
        const total = subtotal + tax;

        const bill = {
            billNumber: this.currentBillNumber,
            customerName: customerName,
            customerPhone: customerPhone,
            items: [...this.cart],
            subtotal: subtotal,
            tax: tax,
            total: total,
            taxRate: this.taxRate,
            date: now.toISOString(),
            timestamp: now.getTime()
        };

        return bill;
    }

    saveBillToHistory(bill) {
        this.billHistory.unshift(bill); // Add to beginning of array
        
        // Keep only last 100 bills
        if (this.billHistory.length > 100) {
            this.billHistory = this.billHistory.slice(0, 100);
        }
        
        localStorage.setItem('hotel_bill_history', JSON.stringify(this.billHistory));
    }

    loadBillHistory() {
        const savedHistory = localStorage.getItem('hotel_bill_history');
        if (savedHistory) {
            this.billHistory = JSON.parse(savedHistory);
        }
    }

    resetForNewOrder() {
        this.cart = [];
        this.generateBillNumber();
        
        // Clear customer info
        const customerNameInput = document.getElementById('customerName');
        const customerPhoneInput = document.getElementById('customerPhone');
        
        if (customerNameInput) customerNameInput.value = '';
        if (customerPhoneInput) customerPhoneInput.value = '';
        
        this.updateDisplay();
        this.saveCartToStorage();
    }

    printBill() {
        if (this.cart.length === 0) {
            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const message = currentLang === 'bn' ? 
                'প্রিন্ট করার জন্য কোন বিল নেই' : 
                'No bill to print';
            this.showToast(message, 'warning');
            return;
        }

        // Create print content
        const printContent = this.generatePrintContent();
        
        // Open print dialog
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    }

    generatePrintContent() {
        const customerName = document.getElementById('customerName')?.value || 'Walk-in Customer';
        const customerPhone = document.getElementById('customerPhone')?.value || 'N/A';
        const now = new Date();
        const subtotal = this.calculateSubtotal();
        const tax = this.calculateTax(subtotal);
        const total = subtotal + tax;

        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        
        let itemsHTML = '';
        this.cart.forEach(item => {
            const itemName = currentLang === 'bn' && item.namebn ? item.namebn : item.name;
            const itemTotal = item.price * item.quantity;
            itemsHTML += `
                <tr>
                    <td>${itemName}</td>
                    <td>${item.quantity}</td>
                    <td>৳${item.price.toFixed(2)}</td>
                    <td>৳${itemTotal.toFixed(2)}</td>
                </tr>
            `;
        });

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Hotel Paradise - Bill</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .bill-info { margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .total-row { font-weight: bold; }
                    .footer { margin-top: 30px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Hotel Paradise</h1>
                    <p>123 Paradise Street, Dhaka</p>
                    <p>Phone: +880 1234-567890 | Email: info@hotelparadise.com</p>
                </div>
                
                <div class="bill-info">
                    <p><strong>Bill Number:</strong> ${this.currentBillNumber}</p>
                    <p><strong>Date:</strong> ${now.toLocaleString()}</p>
                    <p><strong>Customer:</strong> ${customerName}</p>
                    <p><strong>Phone:</strong> ${customerPhone}</p>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                        <tr>
                            <td colspan="3"><strong>Subtotal:</strong></td>
                            <td><strong>৳${subtotal.toFixed(2)}</strong></td>
                        </tr>
                        <tr>
                            <td colspan="3"><strong>Tax (5%):</strong></td>
                            <td><strong>৳${tax.toFixed(2)}</strong></td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="3"><strong>Total:</strong></td>
                            <td><strong>৳${total.toFixed(2)}</strong></td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="footer">
                    <p>Thank you for choosing Hotel Paradise!</p>
                    <p>Visit us again soon!</p>
                </div>
            </body>
            </html>
        `;
    }

    searchBill() {
        const searchInput = document.getElementById('billSearchInput');
        if (!searchInput) return;

        const billNumber = searchInput.value.trim();
        if (!billNumber) {
            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const message = currentLang === 'bn' ? 
                'বিল নম্বর লিখুন' : 
                'Please enter a bill number';
            this.showToast(message, 'warning');
            return;
        }

        const bill = this.billHistory.find(b => b.billNumber === billNumber);
        if (bill) {
            this.displayFoundBill(bill);
        } else {
            const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
            const message = currentLang === 'bn' ? 
                'বিল পাওয়া যায়নি' : 
                'Bill not found';
            this.showToast(message, 'error');
        }
    }

    displayFoundBill(bill) {
        const currentLang = window.languageSystem ? window.languageSystem.currentLanguage : 'en';
        
        let itemsList = bill.items.map(item => {
            const itemName = currentLang === 'bn' && item.namebn ? item.namebn : item.name;
            return `${itemName} x${item.quantity} = ৳${(item.price * item.quantity).toFixed(2)}`;
        }).join('\n');

        const billDetails = `
Bill Number: ${bill.billNumber}
Date: ${new Date(bill.date).toLocaleString()}
Customer: ${bill.customerName}
Phone: ${bill.customerPhone}

Items:
${itemsList}

Subtotal: ৳${bill.subtotal.toFixed(2)}
Tax: ৳${bill.tax.toFixed(2)}
Total: ৳${bill.total.toFixed(2)}
        `;

        alert(billDetails);
    }

    updateCustomerInfo() {
        // This method can be used to validate customer info in real-time
        const customerName = document.getElementById('customerName')?.value.trim();
        const customerPhone = document.getElementById('customerPhone')?.value.trim();
        
        // You can add validation logic here
        // For example, phone number format validation
    }

    saveCartToStorage() {
        localStorage.setItem('hotel_current_cart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('hotel_current_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateDisplay();
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

    // Method to get bill statistics
    getBillStats() {
        const stats = {
            totalBills: this.billHistory.length,
            totalRevenue: this.billHistory.reduce((sum, bill) => sum + bill.total, 0),
            averageBillAmount: 0,
            topItems: {}
        };

        if (stats.totalBills > 0) {
            stats.averageBillAmount = stats.totalRevenue / stats.totalBills;
        }

        // Calculate top items
        this.billHistory.forEach(bill => {
            bill.items.forEach(item => {
                if (!stats.topItems[item.name]) {
                    stats.topItems[item.name] = 0;
                }
                stats.topItems[item.name] += item.quantity;
            });
        });

        return stats;
    }

    // Method to export bill history
    exportBillHistory() {
        return JSON.stringify(this.billHistory, null, 2);
    }

    // Method to get bills by date range
    getBillsByDateRange(startDate, endDate) {
        return this.billHistory.filter(bill => {
            const billDate = new Date(bill.date);
            return billDate >= startDate && billDate <= endDate;
        });
    }
}

// Initialize billing system
document.addEventListener('DOMContentLoaded', () => {
    window.billingSystem = new BillingSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BillingSystem;
}