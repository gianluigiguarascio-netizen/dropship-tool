/**
 * Agente 5 — Contenuti social automatici
 * Cron: ogni 3 ore — pubblica contenuto coinvolgente sul canale Telegram
 */

const TELEGRAM_TOKEN = '8548180810:AAEs1LTBMOXXiibvgQXfhUZoqtf8rm9qKpg';
const CHANNEL_ID = '@dropshopofferte';
const SHOP_URL = 'https://dropship-tool-ecru.vercel.app';

// Tipi di post a rotazione
const POST_TYPES = [
    'flash_sale',
    'categoria_spotlight',
    'promo_canale',
    'tip_risparmio',
    'prodotto_giorno',
    'weekend_sale',
];

const CATEGORIE = [
    { id: 'elettronica', nome: 'Elettronica', emoji: '📱', desc: 'Smartphone, tablet, gadget tech' },
    { id: 'bambini', nome: 'Bambini', emoji: '🧸', desc: 'Giocattoli, giochi educativi, outdoor' },
    { id: 'casa', nome: 'Casa & Cucina', emoji: '🏠', desc: 'Elettrodomestici smart, arredo, cucina' },
    { id: 'moda', nome: 'Moda', emoji: '👔', desc: 'Accessori, borse, orologi' },
    { id: 'donna', nome: 'Donna', emoji: '👗', desc: 'Abbigliamento, scarpe, borse femminili' },
    { id: 'ferramenta', nome: 'Ferramenta', emoji: '🔧', desc: 'Utensili, trapani, set chiavi' },
    { id: 'sport', nome: 'Sport & Fitness', emoji: '💪', desc: 'Attrezzi, yoga, outdoor' },
];

const TIPS_RISPARMIO = [
    '💡 <b>Tip: Controlla le offerte ogni ora!</b>\n\nI nostri prezzi cambiano continuamente. Chi è veloce risparmia di più! ⚡',
    '💡 <b>Tip: Spedizione gratis sopra €49.99!</b>\n\nCombina più prodotti per risparmiare sulle spese di spedizione. 📦',
    '💡 <b>Tip: Prodotti con sconto &gt;80% = Errori di prezzo!</b>\n\nQuando vedi uno sconto sopra l\'80% affrettati, potrebbe essere rimosso presto! 🚨',
    '💡 <b>Tip: Pagamento sicuro con Stripe!</b>\n\nTutti i pagamenti sono protetti. Nessun dato della carta viene salvato. 🔒',
    '💡 <b>Tip: Segui il nostro canale!</b>\n\nAttivia le notifiche per non perdere le flash sale! 🔔',
];

function getPostType(hour) {
    return POST_TYPES[hour % POST_TYPES.length];
}

async function sendTelegram(text, imageUrl = null) {
    const endpoint = imageUrl ? 'sendPhoto' : 'sendMessage';
    const body = imageUrl
        ? { chat_id: CHANNEL_ID, photo: imageUrl, caption: text, parse_mode: 'HTML' }
        : { chat_id: CHANNEL_ID, text, parse_mode: 'HTML', disable_web_page_preview: false };

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
}

export default async function handler(req, res) {
    const now = new Date();
    const hour = now.getUTCHours();
    const postType = getPostType(Math.floor(hour / 3));

    let text = '';

    if (postType === 'flash_sale') {
        const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const endStr = end.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });
        text = `⚡ <b>FLASH SALE — Solo fino alle ${endStr}!</b>

Prezzi ridotti su TUTTA la categoria Elettronica!

🔥 Sconti fino al <b>-85%</b>
📦 Spedizione rapida
✅ Pagamento sicuro Stripe

🛒 <a href="${SHOP_URL}?cat=elettronica">ACQUISTA ORA →</a>

⏰ Offerta limitata nel tempo!
📢 @dropshopofferte`;
    }
    else if (postType === 'categoria_spotlight') {
        const cat = CATEGORIE[Math.floor(Math.random() * CATEGORIE.length)];
        text = `${cat.emoji} <b>SPOTLIGHT: ${cat.nome.toUpperCase()}</b>

${cat.desc}

✨ Prodotti selezionati con i migliori prezzi del web
🔍 Aggiornati ogni ora automaticamente
💰 Risparmi fino all'<b>85%</b>

🛒 <a href="${SHOP_URL}?cat=${cat.id}">Scopri ${cat.nome} →</a>

📢 @dropshopofferte`;
    }
    else if (postType === 'promo_canale') {
        text = `📢 <b>Benvenuti su @dropshopofferte!</b>

Il canale italiano con le <b>migliori offerte del web</b>!

Ogni ora pubblichiamo:
📱 Elettronica scontata
🧸 Prodotti bambini
🏠 Casa & Cucina smart
👗 Moda & Accessori
🔧 Ferramenta & Utensili
💪 Sport & Fitness

💰 Sconti reali fino all'<b>-90%</b>
🔔 Attiva le notifiche per non perderti nulla!

🛒 <a href="${SHOP_URL}">Visita il negozio →</a>`;
    }
    else if (postType === 'tip_risparmio') {
        const tip = TIPS_RISPARMIO[Math.floor(Math.random() * TIPS_RISPARMIO.length)];
        text = `${tip}

🛒 <a href="${SHOP_URL}">DropShop Italia →</a>
📢 @dropshopofferte`;
    }
    else if (postType === 'prodotto_giorno') {
        const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
        const giorno = giorni[now.getDay() === 0 ? 6 : now.getDay() - 1];
        text = `🏆 <b>PRODOTTO DEL ${giorno.toUpperCase()}!</b>

Ogni giorno selezioniamo il prodotto con il miglior rapporto qualità/prezzo!

📦 Aggiornato ogni giorno alle 9:00
🔥 Disponibilità limitata
💰 Prezzo garantito più basso

🛒 <a href="${SHOP_URL}">Scopri oggi's deal →</a>

📢 @dropshopofferte`;
    }
    else if (postType === 'weekend_sale') {
        const dayOfWeek = now.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        text = isWeekend
            ? `🎉 <b>WEEKEND SALE!</b>

Prezzi speciali solo questo weekend su tutto il negozio!

💥 Extra -10% su ordini sopra €30
📦 Spedizione gratis sopra €49.99
⚡ Fino a domenica mezzanotte

🛒 <a href="${SHOP_URL}">Approfitta ora →</a>

📢 @dropshopofferte`
            : `📅 <b>Il weekend si avvicina!</b>

Preparati per le nostre offerte speciali del weekend!

🔔 Attiva le notifiche per non perdere:
• Flash sale sabato mattina
• Extra sconti domenica
• Prodotti esclusivi

🛒 <a href="${SHOP_URL}">Esplora il negozio →</a>

📢 @dropshopofferte`;
    }

    if (text) await sendTelegram(text);

    res.status(200).json({ success: true, postType });
}
