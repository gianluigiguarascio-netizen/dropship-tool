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

    // Stripe (modalità test per ora)
    stripe: {
        publishableKey: 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX', // Sostituisci con la tua chiave
        mode: 'test' // 'test' o 'live'
    },

    // Firebase (sostituisci con le tue credenziali)
    firebase: {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: ''
    },

    // CJDropshipping API
    cjDropshipping: {
        apiKey: '',
        baseUrl: 'https://developers.cjdropshipping.com/api2.0/v1'
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
