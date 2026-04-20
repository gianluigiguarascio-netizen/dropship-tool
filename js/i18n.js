const I18N = {
    currentLang: localStorage.getItem('dropship_lang') || 'it',
    translations: {
        it: {
            nav_all: 'Tutti',
            nav_electronics: 'Elettronica',
            nav_fashion: 'Moda',
            nav_home: 'Casa',
            nav_gadgets: 'Gadget',
            search_placeholder: 'Cerca prodotti...',
            hero_title: 'Scopri i Migliori Prodotti',
            hero_subtitle: 'Elettronica, Moda, Casa e Gadget — Spedizione veloce in tutta Italia',
            hero_cta: 'Esplora il Catalogo',
            products_title: 'I Nostri Prodotti',
            sort_default: 'Ordina per',
            sort_price_asc: 'Prezzo: basso > alto',
            sort_price_desc: 'Prezzo: alto > basso',
            sort_name_asc: 'Nome: A-Z',
            sort_newest: 'Novità',
            loading_products: 'Caricamento prodotti...',
            no_products: 'Nessun prodotto trovato',
            feature_shipping: 'Spedizione Veloce',
            feature_shipping_text: 'Consegna in 5-12 giorni lavorativi in tutta Italia',
            feature_secure: 'Pagamento Sicuro',
            feature_secure_text: 'Transazioni protette con Stripe e PayPal',
            feature_returns: 'Reso Facile',
            feature_returns_text: '14 giorni per restituire senza problemi',
            feature_support: 'Assistenza 24/7',
            feature_support_text: 'Supporto clienti sempre disponibile',
            footer_about: 'Il tuo negozio online di fiducia per elettronica, moda, casa e gadget.',
            footer_links: 'Link Utili',
            footer_about_link: 'Chi Siamo',
            footer_tracking: 'Traccia Ordine',
            footer_returns: 'Resi e Rimborsi',
            footer_contacts: 'Contatti',
            footer_follow: 'Seguici',
            footer_rights: 'Tutti i diritti riservati.',
            cart_title: 'Carrello',
            cart_empty: 'Il carrello è vuoto',
            cart_total: 'Totale:',
            checkout_button: 'Procedi al Pagamento'
        },
        en: {
            nav_all: 'All',
            nav_electronics: 'Electronics',
            nav_fashion: 'Fashion',
            nav_home: 'Home',
            nav_gadgets: 'Gadgets',
            search_placeholder: 'Search products...',
            hero_title: 'Discover the Best Products',
            hero_subtitle: 'Electronics, Fashion, Home and Gadgets — Fast shipping across Italy',
            hero_cta: 'Explore the Catalog',
            products_title: 'Our Products',
            sort_default: 'Sort by',
            sort_price_asc: 'Price: low to high',
            sort_price_desc: 'Price: high to low',
            sort_name_asc: 'Name: A-Z',
            sort_newest: 'Newest',
            loading_products: 'Loading products...',
            no_products: 'No products found',
            feature_shipping: 'Fast Shipping',
            feature_shipping_text: 'Delivery in 5-12 business days across Italy',
            feature_secure: 'Secure Payments',
            feature_secure_text: 'Protected transactions with Stripe and PayPal',
            feature_returns: 'Easy Returns',
            feature_returns_text: '14 days to return with no hassle',
            feature_support: '24/7 Support',
            feature_support_text: 'Customer support always available',
            footer_about: 'Your trusted online shop for electronics, fashion, home and gadgets.',
            footer_links: 'Useful Links',
            footer_about_link: 'About Us',
            footer_tracking: 'Track Order',
            footer_returns: 'Returns & Refunds',
            footer_contacts: 'Contacts',
            footer_follow: 'Follow Us',
            footer_rights: 'All rights reserved.',
            cart_title: 'Cart',
            cart_empty: 'Your cart is empty',
            cart_total: 'Total:',
            checkout_button: 'Proceed to Checkout'
        }
    },

    init() {
        const switcher = document.getElementById('languageSwitcher');
        if (switcher) switcher.value = this.currentLang;
    },

    setLanguage(lang) {
        this.currentLang = lang in this.translations ? lang : 'it';
        localStorage.setItem('dropship_lang', this.currentLang);
        this.apply();
    },

    t(key) {
        return (this.translations[this.currentLang] || {})[key] || key;
    },

    apply() {
        document.documentElement.lang = this.currentLang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = this.t(key);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            el.placeholder = this.t(key);
        });
    }
};