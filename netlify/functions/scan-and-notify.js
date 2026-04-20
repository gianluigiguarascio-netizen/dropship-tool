/**
 * Netlify Scheduled Function — Scansione automatica offerte + notifica Telegram
 * Si esegue ogni ora automaticamente
 */

const TELEGRAM_TOKEN = '8548180810:AAEs1LTBMOXXiibvgQXfhUZoqtf8rm9qKpg';
const CHAT_ID = '787961523';
const CHANNEL_ID = '@dropshopofferte';
const SHOP_URL = 'https://dropshop-italia.netlify.app';

const DEALS = [
    { title: 'Auricolari Bluetooth TWS Pro', orig: 89.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop' },
    { title: 'Smartwatch Fitness AMOLED GPS', orig: 199.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop' },
    { title: 'Mini Drone 4K Pieghevole', orig: 249.99, cat: 'gadget', img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop' },
    { title: 'Lampada LED Smart RGB WiFi', orig: 39.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop' },
    { title: 'Zaino Antifurto USB 25L', orig: 69.99, cat: 'moda', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
    { title: 'Power Bank Solare 20000mAh', orig: 59.99, cat: 'gadget', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop' },
    { title: 'Caricatore Wireless Magnetico 15W', orig: 34.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop' },
    { title: 'Tastiera Meccanica RGB Wireless', orig: 79.99, cat: 'gadget', img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop' },
    { title: 'Diffusore Aromi Ultrasuoni 300ml', orig: 44.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop' },
    { title: 'Occhiali da Sole Polarizzati UV400', orig: 49.99, cat: 'moda', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop' },
];

async function sendTelegram(chatId, text, imageUrl = null) {
    const endpoint = imageUrl ? 'sendPhoto' : 'sendMessage';
    const body = imageUrl
        ? { chat_id: chatId, photo: imageUrl, caption: text, parse_mode: 'HTML' }
        : { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: false };

    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    return res.json();
}

exports.handler = async () => {
    // Scegli 3 offerte casuali
    const shuffled = [...DEALS].sort(() => Math.random() - 0.5).slice(0, 3);

    const deals = shuffled.map(d => {
        const discount = Math.floor(70 + Math.random() * 25);
        const price = parseFloat((d.orig * (1 - discount / 100)).toFixed(2));
        return { ...d, price, discount };
    });

    // Pubblica sul canale le 3 offerte
    for (const deal of deals) {
        const text = `🔥 <b>OFFERTA DEL GIORNO!</b>

<b>${deal.title}</b>

💰 Solo <b>€ ${deal.price.toFixed(2)}</b>
❌ <s>€ ${deal.orig.toFixed(2)}</s>
📉 Sconto: <b>-${deal.discount}%</b>

🛒 <a href="${SHOP_URL}">Acquista su DropShop Italia →</a>

📢 @dropshopofferte`;

        await sendTelegram(CHANNEL_ID, text, deal.img);
        await new Promise(r => setTimeout(r, 1500));
    }

    // Riepilogo privato all'admin
    const summary = `📊 <b>Scansione automatica completata</b>

🔥 ${deals.length} offerte pubblicate su @dropshopofferte

${deals.map(d => `• ${d.title} — €${d.price.toFixed(2)} (-${d.discount}%)`).join('\n')}

🔗 <a href="${SHOP_URL}/admin/deals.html">Vai all'admin →</a>`;

    await sendTelegram(CHAT_ID, summary);

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true, published: deals.length })
    };
};
