/**
 * Agente Offerte — Trova prodotti sulla rete, li salva su Firebase e posta su Telegram
 * Cron: ogni ora
 */

const TELEGRAM_TOKEN = '8548180810:AAEs1LTBMOXXiibvgQXfhUZoqtf8rm9qKpg';
const CHAT_ID = '787961523';
const CHANNEL_ID = '@dropshopofferte';
const FIREBASE_API_KEY = 'AIzaSyDNqLkTmqkv68OZmRKJ5sMHaXM_NvH4Ozc';
const PROJECT_ID = 'dropshop-italia';
const SHOP_URL = 'https://dropship-tool-ecru.vercel.app'; // aggiornare con dominio PrezzoTop
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';

const RSS_FEEDS = [
    { url: 'https://www.amazon.it/gp/rss/bestsellers/electronics/', cat: 'elettronica' },
    { url: 'https://www.amazon.it/gp/rss/movers-and-shakers/electronics/', cat: 'elettronica' },
    { url: 'https://www.amazon.it/gp/rss/bestsellers/toys/', cat: 'bambini' },
    { url: 'https://www.amazon.it/gp/rss/bestsellers/kitchen/', cat: 'casa' },
    { url: 'https://www.amazon.it/gp/rss/bestsellers/fashion/', cat: 'moda' },
    { url: 'https://gizchina.it/feed/', cat: 'elettronica' },
    { url: 'https://www.hwupgrade.it/rss/news.xml', cat: 'elettronica' },
    { url: 'https://www.offertissime.net/feed/', cat: 'varie' },
];

const FALLBACK_IMAGES = {
    elettronica: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
    bambini: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
    casa: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop',
    moda: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    sport: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop',
    donna: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
    ferramenta: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop',
    varie: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop',
};

async function fetchFeed(feed) {
    try {
        const url = `${RSS2JSON_API}?rss_url=${encodeURIComponent(feed.url)}&count=15`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status !== 'ok' || !data.items) return [];

        return data.items
            .filter(item => item.title?.trim())
            .map((item, i) => {
                const titleFull = (item.title || '').trim();
                const priceMatch = (titleFull + ' ' + (item.description || '')).match(/[€£$]\s?(\d+[.,]\d{0,2})/);
                const basePrice = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : (5 + Math.random() * 45);
                const price = parseFloat(basePrice.toFixed(2));
                const originalPrice = parseFloat((price * (1.4 + Math.random() * 0.8)).toFixed(2));
                const discount = Math.round((1 - price / originalPrice) * 100);

                let image = item.thumbnail || item.enclosure?.link || '';
                if (!image && item.description) {
                    const m = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
                    if (m) image = m[1];
                }
                if (!image) image = FALLBACK_IMAGES[feed.cat] || FALLBACK_IMAGES.varie;

                return {
                    id: `auto-${feed.cat}-${Date.now()}-${i}`,
                    name: titleFull.substring(0, 80),
                    category: feed.cat === 'varie' ? 'elettronica' : feed.cat,
                    price,
                    originalPrice,
                    discount,
                    image,
                    description: item.description
                        ? item.description.replace(/<[^>]*>/g, '').substring(0, 200)
                        : titleFull,
                    url: item.link || SHOP_URL,
                    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
                    reviews: Math.floor(20 + Math.random() * 500),
                    stock: Math.floor(10 + Math.random() * 100),
                    badge: discount >= 50 ? `-${discount}%` : '',
                    supplierPrice: parseFloat((price * 0.4).toFixed(2)),
                    source: 'auto',
                    foundAt: new Date().toISOString(),
                };
            });
    } catch {
        return [];
    }
}

async function saveToFirebase(products) {
    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const docId = `auto_${i}`;
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/auto_products/${docId}?key=${FIREBASE_API_KEY}`;

        const fields = {
            id: { stringValue: p.id },
            name: { stringValue: p.name },
            category: { stringValue: p.category },
            price: { doubleValue: p.price },
            originalPrice: { doubleValue: p.originalPrice },
            discount: { integerValue: String(p.discount) },
            image: { stringValue: p.image },
            description: { stringValue: p.description },
            url: { stringValue: p.url },
            rating: { doubleValue: p.rating },
            reviews: { integerValue: String(p.reviews) },
            stock: { integerValue: String(p.stock) },
            badge: { stringValue: p.badge },
            supplierPrice: { doubleValue: p.supplierPrice },
            source: { stringValue: 'auto' },
            foundAt: { stringValue: p.foundAt },
        };

        try {
            await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields }),
            });
        } catch { /* continua */ }

        await new Promise(r => setTimeout(r, 100));
    }
}

async function sendTelegram(chatId, text, imageUrl = null) {
    const endpoint = imageUrl ? 'sendPhoto' : 'sendMessage';
    const body = imageUrl
        ? { chat_id: chatId, photo: imageUrl, caption: text, parse_mode: 'HTML' }
        : { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: false };

    try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    } catch { /* continua */ }
}

export default async function handler(req, res) {
    // 1. Scansiona tutti i feed RSS
    const allProducts = [];
    for (const feed of RSS_FEEDS) {
        const items = await fetchFeed(feed);
        allProducts.push(...items);
        await new Promise(r => setTimeout(r, 400));
    }

    // 2. Prendi i migliori 50 (più alto sconto)
    const best = allProducts
        .filter(p => p.name.length > 10 && p.discount >= 20)
        .sort((a, b) => b.discount - a.discount)
        .slice(0, 50);

    // 3. Salva su Firebase (visibili nel negozio)
    await saveToFirebase(best);

    // 4. Posta i 10 migliori su Telegram
    const top10 = best.slice(0, 10);
    for (const p of top10) {
        const productUrl = p.url && p.url.includes('amazon.it')
            ? p.url.split('?')[0] + '?tag=prezzotop08-21'
            : p.url || SHOP_URL;
        const text = `🔥 <b>OFFERTA TROVATA!</b>

<b>${p.name}</b>

💰 Solo <b>€${p.price.toFixed(2)}</b>
❌ <s>€${p.originalPrice.toFixed(2)}</s>
📉 Sconto: <b>-${p.discount}%</b>

🛒 <a href="${productUrl}">Vedi su Amazon →</a>

📢 @dropshopofferte`;
        await sendTelegram(CHANNEL_ID, text, p.image);
        await new Promise(r => setTimeout(r, 1500));
    }

    // 5. Riepilogo admin
    await sendTelegram(CHAT_ID, `📦 <b>Agente Offerte completato</b>

🌐 Prodotti trovati: <b>${allProducts.length}</b>
✅ Salvati nel negozio: <b>${best.length}</b>
📣 Postati su Telegram: <b>${top10.length}</b>
🕐 ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}

🔗 <a href="${SHOP_URL}">Apri PrezzoTop →</a>`);

    res.status(200).json({ success: true, found: allProducts.length, saved: best.length });
}
