/**
 * Netlify Scheduled Function — Scansione automatica offerte + notifica Telegram
 * Si esegue ogni ora automaticamente
 */

const TELEGRAM_TOKEN = '8548180810:AAEs1LTBMOXXiibvgQXfhUZoqtf8rm9qKpg';
const CHAT_ID = '787961523';
const CHANNEL_ID = '@dropshopofferte';
const SHOP_URL = 'https://dropshop-italia.netlify.app';

const DEALS = [
    // ELETTRONICA
    { title: 'Auricolari Bluetooth TWS Pro ANC 40h', orig: 89.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop' },
    { title: 'Smartwatch Fitness AMOLED GPS SpO2', orig: 199.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop' },
    { title: 'Mini Drone 4K Pieghevole Gimbal 3 Assi', orig: 249.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop' },
    { title: 'Caricatore Wireless Magnetico 15W', orig: 34.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop' },
    { title: 'Tastiera Meccanica RGB Wireless 65%', orig: 79.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop' },
    { title: 'Telecamera WiFi 2K 360° Visione Notturna', orig: 49.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop' },
    { title: 'Mini Proiettore Portatile 1080p WiFi', orig: 129.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=400&h=400&fit=crop' },
    { title: 'Power Bank Solare 20000mAh 22.5W', orig: 59.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop' },
    // BAMBINI
    { title: 'Macchina Radiocomandata Offroad 4x4', orig: 49.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=400&fit=crop' },
    { title: 'Tablet Bambini 7" con Custodia Antiurto', orig: 89.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop' },
    { title: 'Set LEGO Tecnico 500 Pezzi', orig: 59.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop' },
    { title: 'Cuffie Bambini Wireless Volume Limitato', orig: 39.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop' },
    { title: 'Monopattino Elettrico Bambini 6-12 anni', orig: 149.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop' },
    { title: 'Kit Pittura Bambini 120 Colori', orig: 29.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop' },
    { title: 'Tenda Gioco Bambini Castello Principessa', orig: 44.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop' },
    { title: 'Robot Programmabile STEM Bambini 8+', orig: 69.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop' },
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
