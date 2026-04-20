/**
 * DropShop — App principale
 * Gestisce UI, filtri, ricerca, modali e checkout
 */

(function () {
    'use strict';

    // State
    let currentCategory = 'tutti';
    let currentSort = 'default';
    let currentSearch = '';

    // === INIT ===
    document.addEventListener('DOMContentLoaded', () => {
        ProductManager.init();
        Cart.init();
        renderProducts();
        bindEvents();
        hideLoading();
    });

    // === RENDER PRODOTTI ===
    function renderProducts() {
        let products = currentSearch
            ? ProductManager.search(currentSearch)
            : ProductManager.getByCategory(currentCategory);

        products = ProductManager.sort(products, currentSort);

        const grid = document.getElementById('productsGrid');
        const noResults = document.getElementById('noResults');
        const countLabel = document.getElementById('productCountLabel');

        if (products.length === 0) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            countLabel.textContent = '0 prodotti';
            return;
        }

        noResults.style.display = 'none';
        countLabel.textContent = `${products.length} prodott${products.length === 1 ? 'o' : 'i'}`;

        grid.innerHTML = products.map(p => {
            const discount = ProductManager.getDiscount(p);
            return `
            <div class="product-card" data-id="${p.id}">
                <div class="product-img">
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                    ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
                    <div class="product-actions">
                        <button onclick="openProductModal('${p.id}')" title="Anteprima">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${p.category}</div>
                    <div class="product-name">${p.name}</div>
                    <div class="product-rating">
                        <span class="stars">${renderStars(p.rating)}</span>
                        <span class="count">(${p.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="current">${formatPrice(p.price)}</span>
                        ${p.originalPrice > p.price ? `<span class="original">${formatPrice(p.originalPrice)}</span>` : ''}
                        ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" onclick="Cart.add('${p.id}')">
                        <i class="fas fa-cart-plus"></i> Aggiungi al Carrello
                    </button>
                </div>
            </div>`;
        }).join('');
    }

    function renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) stars += '<i class="fas fa-star"></i>';
            else if (i - 0.5 <= rating) stars += '<i class="fas fa-star-half-alt"></i>';
            else stars += '<i class="far fa-star"></i>';
        }
        return stars;
    }

    function hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.style.display = 'none';
    }

    // === EVENT BINDING ===
    function bindEvents() {
        // Navigazione categorie
        document.querySelectorAll('[data-category]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                currentCategory = el.dataset.category;
                currentSearch = '';
                document.getElementById('searchInput').value = '';

                // Aggiorna nav active
                document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
                if (el.closest('.nav')) el.classList.add('active');

                renderProducts();

                // Scroll ai prodotti
                document.getElementById('prodotti').scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Ricerca
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentSearch = searchInput.value;
                currentCategory = 'tutti';
                document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
                renderProducts();
            }, 300);
        });

        // Ordinamento
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderProducts();
        });

        // Carrello toggle
        document.getElementById('cartBtn').addEventListener('click', toggleCart);
        document.getElementById('cartClose').addEventListener('click', toggleCart);
        document.getElementById('cartOverlay').addEventListener('click', toggleCart);

        // Checkout
        document.getElementById('checkoutBtn').addEventListener('click', goToCheckout);

        // Modal close
        document.getElementById('modalClose').addEventListener('click', closeModal);
        document.getElementById('modalOverlay').addEventListener('click', closeModal);

        // Mobile menu
        document.getElementById('mobileMenuBtn').addEventListener('click', () => {
            document.querySelector('.nav').classList.toggle('active');
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
                closeCart();
            }
        });
    }

    // === CARRELLO SIDEBAR ===
    function toggleCart() {
        document.getElementById('cartSidebar').classList.toggle('active');
        document.getElementById('cartOverlay').classList.toggle('active');
        document.body.style.overflow = document.getElementById('cartSidebar').classList.contains('active') ? 'hidden' : '';
    }

    function closeCart() {
        document.getElementById('cartSidebar').classList.remove('active');
        document.getElementById('cartOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    // === MODAL PRODOTTO ===
    window.openProductModal = function (productId) {
        const p = ProductManager.getById(productId);
        if (!p) return;

        const discount = ProductManager.getDiscount(p);
        const profit = ProductManager.getProfit(p);

        document.getElementById('modalBody').innerHTML = `
            <div class="modal-product">
                <div class="modal-product-img">
                    <img src="${p.image}" alt="${p.name}">
                </div>
                <div class="modal-product-info">
                    <div class="product-category">${p.category}</div>
                    <h2>${p.name}</h2>
                    <div class="product-rating">
                        <span class="stars">${renderStars(p.rating)}</span>
                        <span class="count">(${p.reviews} recensioni)</span>
                    </div>
                    <div class="product-price">
                        <span class="current">${formatPrice(p.price)}</span>
                        ${p.originalPrice > p.price ? `<span class="original">${formatPrice(p.originalPrice)}</span>` : ''}
                        ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
                    </div>
                    <p class="description">${p.description}</p>
                    <p style="font-size:0.85rem;color:#636e72;margin-bottom:15px;">
                        <i class="fas fa-box"></i> Disponibilità: <strong>${p.stock > 0 ? p.stock + ' pezzi' : 'Esaurito'}</strong><br>
                        <i class="fas fa-truck"></i> Spedizione: <strong>${CONFIG.freeShippingThreshold <= p.price ? 'Gratuita' : formatPrice(CONFIG.shippingCost)}</strong>
                    </p>
                    <button class="btn btn-primary btn-block" onclick="Cart.add('${p.id}'); closeModal();">
                        <i class="fas fa-cart-plus"></i> Aggiungi al Carrello
                    </button>
                </div>
            </div>`;

        document.getElementById('productModal').classList.add('active');
        document.getElementById('modalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function () {
        document.getElementById('productModal').classList.remove('active');
        document.getElementById('modalOverlay').classList.remove('active');
        document.body.style.overflow = '';
    };

    // === CHECKOUT ===
    function goToCheckout() {
        if (Cart.items.length === 0) return;
        closeCart();
        window.location.href = 'checkout.html';
    }

})();

// === TOAST NOTIFICATION ===
function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}
