/**
 * Agente 3 — Report giornaliero
 * Cron: ogni giorno alle 9:00 (UTC+1 = 8:00 UTC) — riepilogo ordini e incasso
 */

const TELEGRAM_TOKEN = '8548180810:AAEs1LTBMOXXiibvgQXfhUZoqtf8rm9qKpg';
const CHAT_ID = '787961523';
const FIREBASE_API_KEY = 'AIzaSyDNqLkTmqkv68OZmRKJ5sMHaXM_NvH4Ozc';
const PROJECT_ID = 'dropshop-italia';
const SHOP_URL = 'https://dropship-tool-ecru.vercel.app';

async function getTodayOrders() {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/orders?key=${FIREBASE_API_KEY}&pageSize=100`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.documents) return [];

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    return data.documents
        .map(doc => {
            const f = doc.fields || {};
            const createdAt = f.createdAt?.timestampValue
                ? new Date(f.createdAt.timestampValue)
                : new Date(parseInt(f.createdAt?.integerValue || 0));

            return {
                id: doc.name.split('/').pop(),
                customer: f.customerName?.stringValue || f.email?.stringValue || 'Cliente',
                total: parseFloat(f.total?.doubleValue || f.total?.integerValue || 0),
                status: f.status?.stringValue || 'nuovo',
                createdAt,
                products: (f.items?.arrayValue?.values || [])
                    .map(v => v.mapValue?.fields?.name?.stringValue || '')
                    .filter(Boolean)
            };
        })
        .filter(o => o.createdAt >= todayStart);
}

async function getAllTimeStats() {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/orders?key=${FIREBASE_API_KEY}&pageSize=500`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.documents) return { total: 0, revenue: 0 };

    const docs = data.documents.map(doc => {
        const f = doc.fields || {};
        return { total: parseFloat(f.total?.doubleValue || f.total?.integerValue || 0) };
    });

    return {
        total: docs.length,
        revenue: docs.reduce((sum, o) => sum + o.total, 0)
    };
}

export default async function handler(req, res) {
    const [todayOrders, allTime] = await Promise.all([getTodayOrders(), getAllTimeStats()]);

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const completati = todayOrders.filter(o => o.status === 'completato' || o.status === 'spedito').length;

    // Prodotti più venduti oggi
    const productCount = {};
    todayOrders.forEach(o => o.products.forEach(p => {
        productCount[p] = (productCount[p] || 0) + 1;
    }));
    const topProducts = Object.entries(productCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    const oggi = new Date().toLocaleDateString('it-IT', { timeZone: 'Europe/Rome', weekday: 'long', day: 'numeric', month: 'long' });

    const text = `📊 <b>REPORT GIORNALIERO</b>
${oggi.toUpperCase()}

━━━━━━━━━━━━━━
📦 Ordini oggi: <b>${todayOrders.length}</b>
💰 Incasso oggi: <b>€${todayRevenue.toFixed(2)}</b>
✅ Completati: <b>${completati}</b>
⏳ In attesa: <b>${todayOrders.length - completati}</b>

━━━━━━━━━━━━━━
📈 <b>Totale storico</b>
📦 Ordini totali: <b>${allTime.total}</b>
💰 Fatturato totale: <b>€${allTime.revenue.toFixed(2)}</b>

${topProducts.length ? `━━━━━━━━━━━━━━
🏆 <b>Più venduti oggi</b>
${topProducts.map((p, i) => `${['🥇', '🥈', '🥉'][i]} ${p[0]} (${p[1]}x)`).join('\n')}` : ''}

━━━━━━━━━━━━━━
🔗 <a href="${SHOP_URL}/admin/index.html">Apri Admin →</a>`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true })
    });

    res.status(200).json({ success: true, todayOrders: todayOrders.length, todayRevenue });
}
