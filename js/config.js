/**
 * DropShop — Configurazione globale
 * Modifica qui le impostazioni principali del negozio
 */
const CONFIG = {
    // Nome del negozio
    shopName: 'DropShop Italia',

    // Valuta
    currency: 'EUR',
    currencySymbol: '€',
    locale: 'it-IT',

    // Markup automatico: percentuale di ricarico sul prezzo fornitore
    // Es: costo fornitore €10 + markup 40% = prezzo vendita €14
    markupPercent: 40,

    // Spedizione
    shippingCost: 4.99,
    freeShippingThreshold: 49.99, // Spedizione gratuita sopra questa soglia

    // Stripe
    stripe: {
        publishableKey: 'pk_test_51TONQt7XUVJ6sgO3tzeXTmPUPUXsTBVWra553hlEiYQD9iQvXQ8SiTrKEEAUtOZizA8cJEp2qG8oDWZpNRbACgzf009raqmrHi',
        mode: 'test'
    },

    // Firebase
    firebase: {
        apiKey: 'AIzaSyDNqLkTmqkv68OZmRKJ5sMHaXM_NvH4Ozc',
        authDomain: 'dropshop-italia.firebaseapp.com',
        projectId: 'dropshop-italia',
        storageBucket: 'dropshop-italia.firebasestorage.app',
        messagingSenderId: '207007343965',
        appId: '1:207007343965:web:85547054490b287cdcb4b4'
    },

    // CJDropshipping API
    cjDropshipping: {
        apiKey: '',
        baseUrl: 'https://developers.cjdropshipping.com/api2.0/v1'
    },

    // Telegram Bot
    telegram: {
        token: '8548180810:AAEs1LTBMOXXiibvgQXfhUZoqtf8rm9qKpg',
        chatId: '787961523'
    },

    // Email notifiche (configurare con EmailJS o servizio simile)
    email: {
        serviceId: '',
        templateOrderConfirm: '',
        templateShipping: '',
        publicKey: ''
    },

    // Categorie disponibili
    categories: [
        { id: 'elettronica', name: 'Elettronica', icon: 'fas fa-laptop' },
        { id: 'moda', name: 'Moda', icon: 'fas fa-tshirt' },
        { id: 'casa', name: 'Casa', icon: 'fas fa-home' },
        { id: 'gadget', name: 'Gadget', icon: 'fas fa-gamepad' }
    ]
};

// Utility: formatta prezzo in Euro
function formatPrice(price) {
    return new Intl.NumberFormat(CONFIG.locale, {
        style: 'currency',
        currency: CONFIG.currency
    }).format(price);
}

// Utility: calcola prezzo con markup
function applyMarkup(supplierPrice) {
    return supplierPrice * (1 + CONFIG.markupPercent / 100);
}
