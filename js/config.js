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
        publishableKey: 'pk_live_51TONQI56X25NY8YHL30Ix4SVDRTPGszCyQocCDqMCaUT8ohgI1MPnmTzceRIBc4YhxKX84PN8TSa0tLotAYKYUIP005p1y9cxU',
        mode: 'live'
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

    // EmailJS
    email: {
        serviceId: 'service_miya5tg',
        templateOrderConfirm: 'template_10sitej',
        publicKey: 'BNTKk2-EHRZA2oD8f9WwmsEMA6VrLpza5PCFa8MsP4ZKfJ1smzos_w-HwwbuTfIJC1Z5wi6iUOVDxiDfjYVjrQo'
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
