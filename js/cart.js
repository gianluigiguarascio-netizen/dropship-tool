/**
 * DropShop — Gestione Carrello
 * Carrello persistente con localStorage
 */

const Cart = {
    items: [],
    storageKey: 'dropshop_cart',

    init() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try { this.items = JSON.parse(saved); } catch { this.items = []; }
        }
        this.updateUI();
    },

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
        this.updateUI();
    },

    add(productId, qty = 1) {
        const product = ProductManager.getById(productId);
        if (!product) return;

        const existing = this.items.find(i => i.id === productId);
        if (existing) {
            existing.qty += qty;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                qty: qty
            });
        }
        this.save();
        showToast(`${product.name} aggiunto al carrello!`, 'success');
    },

    remove(productId) {
        this.items = this.items.filter(i => i.id !== productId);
        this.save();
    },

    updateQty(productId, qty) {
        const item = this.items.find(i => i.id === productId);
        if (!item) return;
        if (qty <= 0) {
            this.remove(productId);
        } else {
            item.qty = qty;
            this.save();
        }
    },

    getTotal() {
        return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    },

    getCount() {
        return this.items.reduce((sum, i) => sum + i.qty, 0);
    },

    getShipping() {
        const total = this.getTotal();
        if (total >= CONFIG.freeShippingThreshold) return 0;
        return this.items.length > 0 ? CONFIG.shippingCost : 0;
    },

    getGrandTotal() {
        return this.getTotal() + this.getShipping();
    },

    clear() {
        this.items = [];
        this.save();
    },

    updateUI() {
        // Aggiorna contatore
        const countEl = document.getElementById('cartCount');
        if (countEl) countEl.textContent = this.getCount();

        // Aggiorna contenuto carrello
        this.renderCartSidebar();
    },

    renderCartSidebar() {
        const cartItems = document.getElementById('cartItems');
        const cartFooter = document.getElementById('cartFooter');
        const cartTotal = document.getElementById('cartTotal');
        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-cart-plus"></i>
                    <p>Il carrello è vuoto</p>
                </div>`;
            if (cartFooter) cartFooter.style.display = 'none';
            return;
        }

        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-qty">
                        <button onclick="Cart.updateQty('${item.id}', ${item.qty - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.qty}</span>
                        <button onclick="Cart.updateQty('${item.id}', ${item.qty + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="cart-item-remove" onclick="Cart.remove('${item.id}')">
                        <i class="fas fa-trash"></i> Rimuovi
                    </button>
                </div>
            </div>
        `).join('');

        if (cartFooter) cartFooter.style.display = 'block';
        if (cartTotal) cartTotal.textContent = formatPrice(this.getGrandTotal());
    }
};
