/**
 * DropShop — App principale
 * Gestisce UI, filtri, modali, multi-lingua e rating reale
 */
(function () {
    'use strict';

    let currentCategory = 'tutti';
    let currentSort = 'default';
    let currentSearch = '';

    document.addEventListener('DOMContentLoaded', async () => {
        ProductManager.init();
        if (window.ReviewManager) ReviewManager.init();
        Cart.init();

        // Supporto ?cat=CATEGORIA da link Telegram
        const urlCat = new URLSearchParams(window.location.search).get('cat');
        if (urlCat && urlCat !== 'tutti') {
            currentCategory = urlCat;
            document.querySelector(`[data-category="${urlCat}"]`)?.classList.add('active');
            document.querySelector('[data-category="tutti"]')?.classList.remove('active');
            document.getElementById('prodotti')?.scrollIntoView({ behavior: 'smooth' });
        }

        renderProducts();
        bindEvents();
        hideLoading();

        if (window.I18N) {
            I18N.init();
            I18N.apply();
        }

        // Carica prodotti automatici da Firebase (trovati dall'agente)
        loadAutoProducts();
    });

    async function loadAutoProducts() {
        try {
            const apiKey = 'AIzaSyDNqLkTmqkv68OZmRKJ5sMHaXM_NvH4Ozc';
            const projectId = 'dropshop-italia';
            const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/auto_products?key=${apiKey}&pageSize=50`;
            const res = await fetch(url);
            const data = await res.json();
            if (!data.documents) return;

            const autoProducts = data.documents.map(doc => {
                const f = doc.fields || {};
                return {
                    id: f.id?.stringValue || doc.name.split('/').pop(),
                    name: f.name?.stringValue || '',
                    category: f.category?.stringValue || 'elettronica',
                    price: parseFloat(f.price?.doubleValue || f.price?.integerValue || 0),
                    originalPrice: parseFloat(f.originalPrice?.doubleValue || f.originalPrice?.integerValue || 0),
                    image: f.image?.stringValue || '',
                    description: f.description?.stringValue || '',
                    rating: parseFloat(f.rating?.doubleValue || 4),
                    reviews: parseInt(f.reviews?.integerValue || 0),
                    stock: parseInt(f.stock?.integerValue || 10),
                    badge: f.badge?.stringValue || '',
                    supplierPrice: parseFloat(f.supplierPrice?.doubleValue || 0),
                };
            }).filter(p => p.name && p.price > 0);

            if (autoProducts.length > 0) {
                ProductManager.mergeAutoProducts(autoProducts);
                renderProducts();
            }
        } catch { /* silenzioso */ }
    }

    function renderProducts() {
        let products = currentSearch
            ? ProductManager.search(currentSearch)
            : ProductManager.getByCategory(currentCategory);

        products = ProductManager.sort(products, currentSort);

        const grid = document.getElementById('productsGrid');
        const noResults = document.getElementById('noResults');
        const countLabel = document.getElementById('productCountLabel');
        const lang = window.I18N ? I18N.currentLang : 'it';

        if (products.length === 0) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            countLabel.textContent = lang === 'en' ? '0 products' : '0 prodotti';
            return;
        }

        noResults.style.display = 'none';
        countLabel.textContent = lang === 'en'
            ? `${products.length} product${products.length === 1 ? '' : 's'}`
            : `${products.length} prodott${products.length === 1 ? 'o' : 'i'}`;

        grid.innerHTML = products.map(p => {
            const discount = ProductManager.getDiscount(p);
            const ratingData = window.ReviewManager ? ReviewManager.getProductRating(p.id) : { rating: p.rating || 0, count: p.reviews || 0 };
            const rating = ratingData.count ? ratingData.rating : (p.rating || 0);
            const count = ratingData.count || p.reviews || 0;
            return `
            <div class="product-card" data-id="${p.id}">
                <div class="product-img">
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                    ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
                    <div class="product-actions">
                        <button onclick="openProductModal('${p.id}')" title="${lang === 'en' ? 'Open product' : 'Apri prodotto'}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${p.category}</div>
                    <div class="product-name">${p.name}</div>
                    <div class="product-rating">
                        <span class="stars">${renderStars(rating)}</span>
                        <span class="count">(${count})</span>
                    </div>
                    <div class="product-price">
                        <span class="current">${formatPrice(p.price)}</span>
                        ${p.originalPrice > p.price ? `<span class="original">${formatPrice(p.originalPrice)}</span>` : ''}
                        ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
                    </div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <button class="add-to-cart-btn" onclick="Cart.add('${p.id}')">
                            <i class="fas fa-cart-plus"></i> ${lang === 'en' ? 'Add to cart' : 'Aggiungi al Carrello'}
                        </button>
                        <button class="btn btn-outline" onclick="openProductModal('${p.id}')" style="padding:10px 12px;">
                            ${lang === 'en' ? 'Details' : 'Dettagli'}
                        </button>
                    </div>
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

    function bindEvents() {
        document.querySelectorAll('[data-category]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                currentCategory = el.dataset.category;
                currentSearch = '';
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.value = '';

                document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
                if (el.closest('.nav')) el.classList.add('active');

                renderProducts();
                const prodotti = document.getElementById('prodotti');
                if (prodotti) prodotti.scrollIntoView({ behavior: 'smooth' });
            });
        });

        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    currentSearch = searchInput.value;
                    currentCategory = 'tutti';
                    document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
                    renderProducts();
                }, 250);
            });
        }

        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                currentSort = e.target.value;
                renderProducts();
            });
        }

        const lang = document.getElementById('languageSwitcher');
        if (lang) {
            lang.addEventListener('change', (e) => {
                if (window.I18N) {
                    I18N.setLanguage(e.target.value);
                    renderProducts();
                }
            });
        }

        const cartBtn = document.getElementById('cartBtn');
        const cartClose = document.getElementById('cartClose');
        const cartOverlay = document.getElementById('cartOverlay');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        if (cartBtn) cartBtn.addEventListener('click', toggleCart);
        if (cartClose) cartClose.addEventListener('click', toggleCart);
        if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
        if (checkoutBtn) checkoutBtn.addEventListener('click', goToCheckout);
        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                const nav = document.querySelector('.nav');
                if (nav) nav.classList.toggle('active');
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
                closeCart();
            }
        });
    }

    function toggleCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        if (!sidebar || !overlay) return;
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    function closeCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        if (!sidebar || !overlay) return;
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    window.openProductModal = function (productId) {
        const p = ProductManager.getById(productId);
        if (!p) return;

        const discount = ProductManager.getDiscount(p);
        const ratingData = window.ReviewManager ? ReviewManager.getProductRating(p.id) : { rating: p.rating || 0, count: p.reviews || 0 };
        const lang = window.I18N ? I18N.currentLang : 'it';

        document.getElementById('modalBody').innerHTML = `
            <div class="modal-product">
                <div class="modal-product-img">
                    <img src="${p.image}" alt="${p.name}">
                </div>
                <div class="modal-product-info">
                    <div class="product-category">${p.category}</div>
                    <h2>${p.name}</h2>
                    <div class="product-rating">
                        <span class="stars">${renderStars(ratingData.rating || p.rating || 0)}</span>
                        <span class="count">(${ratingData.count || p.reviews || 0} ${lang === 'en' ? 'reviews' : 'recensioni'})</span>
                    </div>
                    <div class="product-price">
                        <span class="current">${formatPrice(p.price)}</span>
                        ${p.originalPrice > p.price ? `<span class="original">${formatPrice(p.originalPrice)}</span>` : ''}
                        ${discount > 0 ? `<span class="discount">-${discount}%</span>` : ''}
                    </div>
                    <p class="description">${p.description}</p>
                    <p style="font-size:0.85rem;color:#636e72;margin-bottom:15px;">
                        <i class="fas fa-box"></i> ${lang === 'en' ? 'Availability' : 'Disponibilità'}: <strong>${p.stock > 0 ? p.stock + ' pezzi' : 'Esaurito'}</strong><br>
                        <i class="fas fa-truck"></i> ${lang === 'en' ? 'Shipping' : 'Spedizione'}: <strong>${CONFIG.freeShippingThreshold <= p.price ? (lang === 'en' ? 'Free' : 'Gratuita') : formatPrice(CONFIG.shippingCost)}</strong>
                    </p>
                    <div style="display:flex;gap:10px;flex-wrap:wrap;">
                        <button class="btn btn-primary btn-block" onclick="Cart.add('${p.id}'); closeModal();">
                            <i class="fas fa-cart-plus"></i> ${lang === 'en' ? 'Add to cart' : 'Aggiungi al Carrello'}
                        </button>
                        <button class="btn btn-outline" onclick="closeModal()">
                            ${lang === 'en' ? 'Close' : 'Chiudi'}
                        </button>
                    </div>
                </div>
            </div>`;

        document.getElementById('productModal').classList.add('active');
        document.getElementById('modalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function () {
        const productModal = document.getElementById('productModal');
        const modalOverlay = document.getElementById('modalOverlay');
        if (productModal) productModal.classList.remove('active');
        if (modalOverlay) modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    function goToCheckout() {
        if (Cart.items.length === 0) return;
        closeCart();
        window.location.href = 'checkout.html';
    }
})();

function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}
