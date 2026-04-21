/**
 * Agente 4 — Monitoraggio prezzi concorrenti
 * Cron: ogni giorno alle 10:00 — analizza bestseller Amazon IT e segnala opportunità
 */

const TELEGRAM_TOKEN = '8548180810:AAEs1LTBMOXXiibvgQXfhUZoqtf8rm9qKpg';
const CHAT_ID = '787961523';
const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';
const SHOP_URL = 'https://dropship-tool-ecru.vercel.app';

const AMAZON_FEEDS = [
    { name: 'Bestseller Elettronica', url: 'https://www.amazon.it/gp/rss/bestsellers/electronics/', cat: 'elettronica' },
    { name: 'Movers & Shakers Elettronica', url: 'https://www.amazon.it/gp/rss/movers-and-shakers/electronics/', cat: 'elettronica' },
    { name: 'Bestseller Giocattoli', url: 'https://www.amazon.it/gp/rss/bestsellers/toys/', cat: 'bambini' },
    { name: 'Bestseller Casa & Cucina', url: 'https://www.amazon.it/gp/rss/bestsellers/kitchen/', cat: 'casa' },
    { name: 'Bestseller Abbigliamento', url: 'https://www.amazon.it/gp/rss/bestsellers/fashion/', cat: 'moda' },
    { name: 'Bestseller Sport', url: 'https://www.amazon.it/gp/rss/bestsellers/sporting-goods/', cat: 'sport' },
];

async function fetchFeed(feed) {
    try {
        const url = `${RSS2JSON_API}?rss_url=${encodeURIComponent(feed.url)}&count=10`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status !== 'ok' || !data.items) return [];
        return data.items.map(item => {
            const priceMatch = (item.title + ' ' + (item.description || '')).match(/[€£$]\s?(\d+[.,]\d{0,2})/);
            const price = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : null;
            return { title: (item.title || '').substring(0, 80), price, cat: feed.cat };
        }).filter(i => i.title);
    } catch {
        return [];
    }
}

export default async function handler(req, res) {
    const allProducts = [];

    for (const feed of AMAZON_FEEDS) {
        const items = await fetchFeed(feed);
        allProducts.push(...items);
        await new Promise(r => setTimeout(r, 400));
    }

    // Raggruppa per categoria e trova i prodotti con prezzo
    const withPrice = allProducts.filter(p => p.price && p.price < 100);
    const cheapOpportunities = withPrice
        .filter(p => p.price < 30)
        .sort((a, b) => a.price - b.price)
        .slice(0, 10);

    const byCategory = {};
    allProducts.forEach(p => {
        if (!byCategory[p.cat]) byCategory[p.cat] = [];
        byCategory[p.cat].push(p.title);
    });

    const topPerCat = Object.entries(byCategory)
        .map(([cat, items]) => `📂 <b>${cat}</b>: ${items.slice(0, 2).join(', ')}`)
        .join('\n');

    const text = `🕵️ <b>ANALISI CONCORRENTI — Amazon IT</b>
${new Date().toLocaleDateString('it-IT', { timeZone: 'Europe/Rome', day: 'numeric', month: 'long' })}

━━━━━━━━━━━━━━
📊 Prodotti analizzati: <b>${allProducts.length}</b>
💡 Con prezzo visibile: <b>${withPrice.length}</b>

━━━━━━━━━━━━━━
🔥 <b>Trending per categoria</b>
${topPerCat}

${cheapOpportunities.length ? `━━━━━━━━━━━━━━
💰 <b>Opportunità &lt;€30</b>
${cheapOpportunities.slice(0, 5).map(p => `• ${p.title} — €${p.price.toFixed(2)}`).join('\n')}` : ''}

━━━━━━━━━━━━━━
💡 <i>Aggiungi questi prodotti al negozio per cavalcare il trend!</i>
🔗 <a href="${SHOP_URL}/admin/deals.html">Aggiungi prodotti →</a>`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true })
    });

    res.status(200).json({ success: true, analyzed: allProducts.length, opportunities: cheapOpportunities.length });
}
