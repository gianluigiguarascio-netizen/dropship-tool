# DropShop Italia — Tool Dropshipping Automatico

## Struttura

```
dropship-tool/
├── index.html          # Storefront (negozio clienti)
├── checkout.html       # Pagina checkout
├── conferma.html       # Conferma ordine
├── tracking.html       # Tracking ordine clienti
├── admin/
│   └── index.html      # Dashboard amministratore
├── css/
│   └── style.css       # Stili globali
├── js/
│   ├── config.js       # Configurazione (prezzi, API keys, markup)
│   ├── products.js     # Database prodotti + ProductManager
│   ├── cart.js         # Gestione carrello (localStorage)
│   ├── app.js          # Logica UI storefront
│   └── automation.js   # Automazione: ordini, tracking, email, sync
└── img/                # Immagini locali (opzionale)
```

## Deploy su GitHub Pages

1. Crea repository su GitHub
2. Pusha tutti i file
3. Settings > Pages > Source: main branch
4. Il sito sarà su: https://tuousername.github.io/dropship-tool/

## Configurazione

### 1. Stripe (Pagamenti)
1. Registrati su https://stripe.com
2. Prendi la Publishable Key da Dashboard > Developers > API keys
3. Inseriscila in Admin > Impostazioni

### 2. CJDropshipping (Fornitore)
1. Registrati su https://cjdropshipping.com
2. Vai su API Center > Get API Key
3. Inserisci la key in Admin > Impostazioni
4. I prodotti si sincronizzano automaticamente

### 3. Email Automatiche (EmailJS)
1. Registrati su https://www.emailjs.com (gratis fino 200 email/mese)
2. Crea un servizio email (Gmail)
3. Crea template per: conferma ordine, spedizione, consegna
4. Inserisci Service ID e Public Key nelle impostazioni

## Funzionalità

- [x] Storefront responsive con catalogo prodotti
- [x] Carrello persistente (localStorage)
- [x] Checkout con raccolta dati spedizione
- [x] Dashboard Admin completa
- [x] Gestione prodotti (CRUD)
- [x] Markup automatico sui prezzi
- [x] Gestione ordini con stati
- [x] Calcolo profitto automatico
- [x] Tracking ordini per clienti
- [x] Inoltro automatico ordini a CJDropshipping
- [x] Sync automatico prezzi e disponibilità
- [x] Email automatiche (conferma, spedizione, consegna)
- [x] Log automazione

## Prossimi Passi

- [ ] Integrazione Stripe Checkout reale
- [ ] Firebase per database persistente cloud
- [ ] Dominio personalizzato
- [ ] SEO e meta tag Open Graph
- [ ] Notifiche WhatsApp/Telegram
