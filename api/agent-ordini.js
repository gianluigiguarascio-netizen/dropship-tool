/**
 * Agente 2 — Monitoraggio ordini
 * Cron: ogni 5 minuti — controlla nuovi ordini su Firebase e notifica Telegram admin
 */

const TELEGRAM_TOKEN = '8548180810:AAEs1LTBMOXXiibvgQXfhUZoqtf8rm9qKpg';
const CHAT_ID = '787961523';
const FIREBASE_API_KEY = 'AIzaSyDNqLkTmqkv68OZmRKJ5sMHaXM_NvH4Ozc';
const PROJECT_ID = 'dropshop-italia';
const SHOP_URL = 'https://dropship-tool-ecru.vercel.app';

async function getRecentOrders() {
    // Prendi gli ultimi 20 ordini ordinati per data
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/orders?key=${FIREBASE_API_KEY}&pageSize=20&orderBy=createdAt desc`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.documents) return [];

    const cutoff = Date.now() - 6 * 60 * 1000; // ultimi 6 minuti (overlap di sicurezza)

    return data.documents
        .map(doc => {
            const f = doc.fields || {};
            const createdAt = f.createdAt?.timestampValue
                ? new Date(f.createdAt.timestampValue).getTime()
                : f.createdAt?.integerValue
                    ? parseInt(f.createdAt.integerValue)
                    : 0;

            return {
                id: doc.name.split('/').pop(),
                customer: f.customerName?.stringValue || f.email?.stringValue || 'Cliente',
                email: f.email?.stringValue || '',
                total: parseFloat(f.total?.doubleValue || f.total?.integerValue || 0),
                items: parseInt(f.itemCount?.integerValue || 1),
                status: f.status?.stringValue || 'nuovo',
                createdAt,
                products: (f.items?.arrayValue?.values || [])
                    .map(v => v.mapValue?.fields?.name?.stringValue || v.stringValue || '')
                    .filter(Boolean)
                    .slice(0, 3)
            };
        })
        .filter(o => o.createdAt >= cutoff);
}

async function sendTelegram(chatId, text) {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
}

export default async function handler(req, res) {
    const orders = await getRecentOrders();

    if (orders.length === 0) {
        return res.status(200).json({ success: true, newOrders: 0 });
    }

    for (const order of orders) {
        const text = `🛒 <b>NUOVO ORDINE!</b>

👤 Cliente: <b>${order.customer}</b>
📧 ${order.email}
💰 Totale: <b>€${order.total.toFixed(2)}</b>
📦 Prodotti: ${order.items}
🆔 Ordine: <code>${order.id}</code>
${order.products.length ? `\n🛍️ ${order.products.join(', ')}` : ''}

✅ Stato: <b>${order.status}</b>

🔗 <a href="${SHOP_URL}/admin/index.html">Gestisci ordini →</a>`;

        await sendTelegram(CHAT_ID, text);
        await new Promise(r => setTimeout(r, 500));
    }

    res.status(200).json({ success: true, newOrders: orders.length });
}
