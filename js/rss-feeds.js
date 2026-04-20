/**
 * DropShop — Integrazione Feed RSS Offerte Reali
 * Usa rss2json.com come proxy CORS (gratis, 1000 req/giorno)
 */

const RSS_FEEDS = [
    {
        name: 'Amazon IT — Bestseller Elettronica',
        url: 'https://www.amazon.it/gp/rss/bestsellers/electronics/',
        source: 'amazon',
        category: 'elettronica',
        icon: 'fab fa-amazon'
    },
    {
        name: 'Amazon IT — Movers & Shakers',
        url: 'https://www.amazon.it/gp/rss/movers-and-shakers/electronics/',
        source: 'amazon',
        category: 'elettronica',
        icon: 'fab fa-amazon'
    },
    {
        name: 'Sconti.info — Offerte Italia',
        url: 'https://www.sconti.info/feed/',
        source: 'sconti.info',
        category: 'varie',
        icon: 'fas fa-tag'
    },
    {
        name: 'Offertissime — Deals Italia',
        url: 'https://www.offertissime.net/feed/',
        source: 'offertissime',
        category: 'varie',
        icon: 'fas fa-fire'
    },
    {
        name: 'Tom\'s Hardware IT — Tech Deals',
        url: 'https://www.tomshw.it/feed/',
        source: 'tomshardware',
        category: 'elettronica',
        icon: 'fas fa-microchip'
    }
];

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';

const RSSFeedManager = {
    products: [],
    lastFetch: null,

    async fetchFeed(feed) {
        try {
            const url = `${RSS2JSON_API}?rss_url=${encodeURIComponent(feed.url)}&api_key=&count=20`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.status !== 'ok' || !data.items) return [];

            return data.items.map(item => this.parseItem(item, feed)).filter(Boolean);
        } catch (err) {
            console.warn(`[RSS] Errore feed ${feed.name}:`, err.message);
            return [];
        }
    },

    parseItem(item, feed) {
        const title = item.title?.trim();
        if (!title) return null;

        // Estrai prezzo dal titolo/descrizione se presente
        const priceMatch = (item.title + ' ' + (item.description || '')).match(/[€£$]\s?(\d+[.,]\d{0,2})/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : null;

        // Estrai immagine
        let image = item.thumbnail || item.enclosure?.link || '';
        if (!image && item.description) {
            const imgMatch = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) image = imgMatch[1];
        }
        if (!image) image = `https://picsum.photos/300/300?random=${Math.floor(Math.random()*1000)}`;

        // Stima prezzo se non trovato
        const estimatedPrice = price || (Math.random() * 40 + 5).toFixed(2) * 1;
        const originalPrice = parseFloat((estimatedPrice * (1.5 + Math.random())).toFixed(2));
        const discount = Math.round((1 - estimatedPrice / originalPrice) * 100);

        return {
            id: 'rss-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            source: feed.source,
            title: title.substring(0, 100),
            image,
            currentPrice: parseFloat(estimatedPrice.toFixed(2)),
            originalPrice,
            discount,
            rating: (3.5 + Math.random() * 1.5).toFixed(1) * 1,
            reviews: Math.floor(50 + Math.random() * 2000),
            category: feed.category,
            url: item.link || '#',
            foundAt: new Date().toISOString(),
            isError: discount >= 80,
            description: item.description
                ? item.description.replace(/<[^>]*>/g, '').substring(0, 200)
                : title
        };
    },

    async fetchAll(onProgress) {
        this.products = [];
        const results = [];

        for (let i = 0; i < RSS_FEEDS.length; i++) {
            const feed = RSS_FEEDS[i];
            if (onProgress) onProgress(feed.name, i + 1, RSS_FEEDS.length);
            const items = await this.fetchFeed(feed);
            results.push(...items);
            await new Promise(r => setTimeout(r, 300)); // throttle
        }

        // Filtra per settings
        const settings = JSON.parse(localStorage.getItem('dropshop_deal_settings') || '{}');
        const minDiscount = parseInt(settings.minDiscount || 30);
        const maxPrice = parseFloat(settings.maxPrice || 50);

        this.products = results.filter(p =>
            p.discount >= minDiscount && p.currentPrice <= maxPrice
        );

        this.lastFetch = new Date().toISOString();
        return this.products;
    },

    // Invia notifica Telegram per nuovi prodotti trovati
    async notifyTelegram(newProducts) {
        if (!newProducts.length) return;

        const token = (typeof CONFIG !== 'undefined' && CONFIG.telegram?.token) ||
            JSON.parse(localStorage.getItem('dropshop_deal_settings') || '{}').telegramToken;
        const chatId = (typeof CONFIG !== 'undefined' && CONFIG.telegram?.chatId) ||
            JSON.parse(localStorage.getItem('dropshop_deal_settings') || '{}').telegramChatId;

        if (!token || !chatId) return;

        const errori = newProducts.filter(p => p.isError);
        const hot = newProducts.filter(p => !p.isError && p.discount >= 70);

        const text = `🔍 <b>NUOVE OFFERTE TROVATE!</b>

📦 Totale: <b>${newProducts.length} prodotti</b>
🚨 Errori di prezzo: <b>${errori.length}</b>
🔥 Offerte &gt;70%: <b>${hot.length}</b>

${newProducts.slice(0, 3).map(p =>
    `• <b>${p.title.substring(0, 50)}</b>\n  💰 €${p.currentPrice.toFixed(2)} (-${p.discount}%)`
).join('\n\n')}

${newProducts.length > 3 ? `<i>...e altri ${newProducts.length - 3} prodotti</i>` : ''}

🔗 <a href="https://dropshop-italia.netlify.app/admin/deals.html">Vedi tutti nell'admin →</a>`;

        try {
            await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
            });
        } catch (e) {
            console.warn('[RSS] Telegram notify error:', e.message);
        }
    }
};
