/**
 * Agente 1 — Offerte automatiche
 * Cron: ogni ora — pubblica 10 offerte su @dropshopofferte + riepilogo admin
 */

const TELEGRAM_TOKEN = '8548180810:AAEs1LTBMOXXiibvgQXfhUZoqtf8rm9qKpg';
const CHAT_ID = '787961523';
const CHANNEL_ID = '@dropshopofferte';
const SHOP_URL = 'https://dropship-tool-ecru.vercel.app';

const DEALS = [
    { title: 'Auricolari Bluetooth TWS Pro ANC 40h', orig: 89.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop' },
    { title: 'Smartwatch Fitness AMOLED GPS SpO2', orig: 199.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop' },
    { title: 'Mini Drone 4K Pieghevole Gimbal 3 Assi', orig: 249.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop' },
    { title: 'Caricatore Wireless Magnetico 15W', orig: 34.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop' },
    { title: 'Tastiera Meccanica RGB Wireless 65%', orig: 79.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop' },
    { title: 'Telecamera WiFi 2K 360° Visione Notturna', orig: 49.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop' },
    { title: 'Mini Proiettore Portatile 1080p WiFi', orig: 129.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=400&h=400&fit=crop' },
    { title: 'Power Bank Solare 20000mAh 22.5W', orig: 59.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop' },
    { title: 'Mouse Gaming Wireless 16000 DPI RGB', orig: 59.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop' },
    { title: 'SSD Esterno 1TB USB-C 1000MB/s', orig: 99.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop' },
    { title: 'Ring Light LED 18" + Treppiede 2m', orig: 69.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop' },
    { title: 'Altoparlante Bluetooth Waterproof 40W', orig: 79.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop' },
    { title: 'Controller PS5/PC Wireless RGB', orig: 59.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&h=400&fit=crop' },
    { title: 'Microfono Condenser USB Studio', orig: 54.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop' },
    { title: 'Hub USB-C 10 in 1 HDMI 4K', orig: 49.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400&h=400&fit=crop' },
    { title: 'Macchina Radiocomandata Offroad 4x4', orig: 49.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=400&fit=crop' },
    { title: 'Tablet Bambini 7" Custodia Antiurto', orig: 89.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop' },
    { title: 'Set LEGO Tecnico 500 Pezzi', orig: 59.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop' },
    { title: 'Robot Programmabile STEM Bambini 8+', orig: 69.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop' },
    { title: 'Monopattino Elettrico Bambini 6-12 anni', orig: 149.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop' },
    { title: 'Lampada LED Smart RGB WiFi Alexa', orig: 39.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop' },
    { title: 'Robot Aspirapolvere WiFi Mappatura Laser', orig: 299.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop' },
    { title: 'Friggitrice ad Aria 8L Touch Screen', orig: 129.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1648733966573-8c2a9d576800?w=400&h=400&fit=crop' },
    { title: 'Diffusore Aromi Ultrasuoni 500ml LED', orig: 44.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop' },
    { title: 'Zaino Viaggio 40L Espandibile Laptop 17"', orig: 79.99, cat: 'moda', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
    { title: 'Occhiali da Sole Polarizzati UV400', orig: 49.99, cat: 'moda', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop' },
    { title: 'Orologio Minimalista Acciaio Uomo/Donna', orig: 69.99, cat: 'moda', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop' },
    { title: 'Tapis Roulant Pieghevole 12km/h LCD', orig: 299.99, cat: 'sport', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop' },
    { title: 'Set Manubri Regolabili 2-24kg', orig: 89.99, cat: 'sport', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop' },
    { title: 'Stuoia Yoga Antiscivolo 6mm', orig: 29.99, cat: 'sport', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop' },
    { title: 'Spazzola Capelli Lisciante Ionica 230°', orig: 49.99, cat: 'donna', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop' },
    { title: 'Borsa a Spalla Pelle PU Donna', orig: 59.99, cat: 'donna', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop' },
    { title: 'Scarpe Donna Plateau Casual', orig: 54.99, cat: 'donna', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop' },
    { title: 'Trapano Avvitatore 18V con Batteria', orig: 69.99, cat: 'ferramenta', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop' },
    { title: 'Set Chiavi Dinamometriche 72 Pezzi', orig: 49.99, cat: 'ferramenta', img: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop' },
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

export default async function handler(req, res) {
    const shuffled = [...DEALS].sort(() => Math.random() - 0.5).slice(0, 10);

    const deals = shuffled.map(d => {
        const discount = Math.floor(70 + Math.random() * 25);
        const price = parseFloat((d.orig * (1 - discount / 100)).toFixed(2));
        return { ...d, price, discount };
    });

    for (const deal of deals) {
        const shopLink = `${SHOP_URL}?cat=${deal.cat}`;
        const text = `🔥 <b>OFFERTA DEL GIORNO!</b>

<b>${deal.title}</b>

💰 Solo <b>€ ${deal.price.toFixed(2)}</b>
❌ <s>€ ${deal.orig.toFixed(2)}</s>
📉 Sconto: <b>-${deal.discount}%</b>

🛒 <a href="${shopLink}">Vedi offerte ${deal.cat} →</a>

📢 @dropshopofferte`;

        await sendTelegram(CHANNEL_ID, text, deal.img);
        await new Promise(r => setTimeout(r, 1500));
    }

    const summary = `📊 <b>Agente Offerte — Completato</b>

🔥 ${deals.length} offerte pubblicate su @dropshopofferte
🕐 ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}

${deals.slice(0, 5).map(d => `• ${d.title} — €${d.price.toFixed(2)} (-${d.discount}%)`).join('\n')}
${deals.length > 5 ? `\n<i>...e altre ${deals.length - 5}</i>` : ''}

🔗 <a href="${SHOP_URL}/admin/deals.html">Admin →</a>`;

    await sendTelegram(CHAT_ID, summary);

    res.status(200).json({ success: true, published: deals.length });
}
