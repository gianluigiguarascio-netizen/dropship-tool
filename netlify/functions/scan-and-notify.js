/**
 * Netlify Scheduled Function — Scansione automatica offerte + notifica Telegram
 * Si esegue ogni ora automaticamente
 */

const TELEGRAM_TOKEN = '8548180810:AAEs1LTBMOXXiibvgQXfhUZoqtf8rm9qKpg';
const CHAT_ID = '787961523';
const CHANNEL_ID = '@dropshopofferte';
const SHOP_URL = 'https://dropship-tool-ecru.vercel.app';

// Gruppi dove il bot è admin — aggiungi qui i chat_id dei tuoi gruppi
const GROUPS = [];

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
    { title: 'Mouse Gaming Wireless 16000 DPI RGB', orig: 59.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop' },
    { title: 'SSD Esterno 1TB USB-C 1000MB/s', orig: 99.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop' },
    { title: 'Ring Light LED 18" + Treppiede 2m', orig: 69.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop' },
    { title: 'Altoparlante Bluetooth Waterproof 40W', orig: 79.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop' },
    { title: 'Controller PS5/PC Wireless RGB', orig: 59.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&h=400&fit=crop' },
    { title: 'Scheda Video USB Cattura HDMI 4K', orig: 44.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop' },
    { title: 'Microfono Condenser USB Studio', orig: 54.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop' },
    { title: 'Supporto Laptop Alluminio 6 Livelli', orig: 39.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop' },
    { title: 'Hub USB-C 10 in 1 HDMI 4K', orig: 49.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400&h=400&fit=crop' },
    { title: 'Cavi USB-C 100W Pack 5 pezzi Intrecciati', orig: 24.99, cat: 'elettronica', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop' },
    // BAMBINI
    { title: 'Macchina Radiocomandata Offroad 4x4', orig: 49.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=400&fit=crop' },
    { title: 'Tablet Bambini 7" Custodia Antiurto', orig: 89.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop' },
    { title: 'Set LEGO Tecnico 500 Pezzi', orig: 59.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop' },
    { title: 'Cuffie Bambini Wireless Volume Limitato', orig: 39.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop' },
    { title: 'Monopattino Elettrico Bambini 6-12 anni', orig: 149.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop' },
    { title: 'Kit Pittura Bambini 120 Colori', orig: 29.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop' },
    { title: 'Tenda Gioco Bambini Castello Principessa', orig: 44.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop' },
    { title: 'Robot Programmabile STEM Bambini 8+', orig: 69.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop' },
    { title: 'Bicicletta Bambini 16" con Rotelle', orig: 89.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1558618047-3c9c1b4ef500?w=400&h=400&fit=crop' },
    { title: 'Piscina Gonfiabile Bambini 3 Anelli', orig: 34.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1519671282429-b8f4a53a7d1a?w=400&h=400&fit=crop' },
    { title: 'Zaino Scuola Bambini Ergonomico LED', orig: 39.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
    { title: 'Puzzle 3D Legno 200 Pezzi Bambini', orig: 24.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400&h=400&fit=crop' },
    { title: 'Set Cucina Giocattolo 35 Accessori', orig: 44.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1558618047-3c9c1b4ef500?w=400&h=400&fit=crop' },
    { title: 'Walkie Talkie Bambini 3km Portata', orig: 29.99, cat: 'bambini', img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop' },
    // CASA
    { title: 'Lampada LED Smart RGB WiFi Alexa', orig: 39.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop' },
    { title: 'Robot Aspirapolvere WiFi Mappatura Laser', orig: 299.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop' },
    { title: 'Friggitrice ad Aria 8L Touch Screen', orig: 129.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1648733966573-8c2a9d576800?w=400&h=400&fit=crop' },
    { title: 'Diffusore Aromi Ultrasuoni 500ml LED', orig: 44.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=400&fit=crop' },
    { title: 'Set Coltelli Cucina Professionale 6 pz', orig: 59.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=400&fit=crop' },
    { title: 'Organizer Armadio Bambù 10 pz', orig: 34.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400&h=400&fit=crop' },
    { title: 'Bilancia Smart WiFi Body Composition', orig: 39.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&h=400&fit=crop' },
    { title: 'Tenda Doccia Antimuffa 3D Impermeabile', orig: 19.99, cat: 'casa', img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=400&fit=crop' },
    // MODA
    { title: 'Zaino Viaggio 40L Espandibile Laptop 17"', orig: 79.99, cat: 'moda', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
    { title: 'Occhiali da Sole Polarizzati UV400', orig: 49.99, cat: 'moda', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop' },
    { title: 'Orologio Minimalista Acciaio Uomo/Donna', orig: 69.99, cat: 'moda', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop' },
    { title: 'Giacca Impermeabile Softshell 3-in-1', orig: 89.99, cat: 'moda', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop' },
    { title: 'Portafoglio Uomo RFID Slim Pelle', orig: 29.99, cat: 'moda', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop' },
    { title: 'Cintura Automatica Uomo Elegante', orig: 24.99, cat: 'moda', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop' },
    // SPORT & FITNESS
    { title: 'Tapis Roulant Pieghevole 12km/h LCD', orig: 299.99, cat: 'sport', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop' },
    { title: 'Set Manubri Regolabili 2-24kg', orig: 89.99, cat: 'sport', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop' },
    { title: 'Stuoia Yoga Antiscivolo 6mm', orig: 29.99, cat: 'sport', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop' },
    { title: 'Borraccia Termica 500ml 24h Freddo', orig: 24.99, cat: 'sport', img: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&h=400&fit=crop' },
    { title: 'Fascia Sportiva Cardiofrequenzimetro', orig: 39.99, cat: 'sport', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' },
    // BELLEZZA
    { title: 'Spazzola Capelli Lisciante Ionica 230°', orig: 49.99, cat: 'bellezza', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop' },
    { title: 'Epilatore Elettrico Donna IPL', orig: 79.99, cat: 'bellezza', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop' },
    { title: 'Kit Denti Bianchi LED + Gel 3 sieri', orig: 34.99, cat: 'bellezza', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop' },
    { title: 'Massaggiatore Viso Lifting Microcorrenti', orig: 44.99, cat: 'bellezza', img: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop' },
    { title: 'Asciugacapelli Ionico 2400W Anti-Crespo', orig: 59.99, cat: 'bellezza', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop' },
    // CUCINA
    { title: 'Macchina Caffè Espresso 15 Bar', orig: 89.99, cat: 'cucina', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop' },
    { title: 'Robot Cucina Multifunzione 1500W', orig: 149.99, cat: 'cucina', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop' },
    { title: 'Padella Antiaderente Ceramica 28cm', orig: 34.99, cat: 'cucina', img: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=400&fit=crop' },
    { title: 'Tostapane 4 Fette LCD Timer', orig: 39.99, cat: 'cucina', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=400&fit=crop' },
    { title: 'Contenitori Sottovuoto Cibo 10 pz', orig: 29.99, cat: 'cucina', img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop' },
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
    // Scegli 10 offerte casuali da categorie diverse
    const shuffled = [...DEALS].sort(() => Math.random() - 0.5).slice(0, 10);

    const deals = shuffled.map(d => {
        const discount = Math.floor(70 + Math.random() * 25);
        const price = parseFloat((d.orig * (1 - discount / 100)).toFixed(2));
        return { ...d, price, discount };
    });

    // Pubblica sul canale le 3 offerte
    for (const deal of deals) {
        const catMap = {
            elettronica: 'elettronica', gadget: 'gadget', casa: 'casa',
            moda: 'moda', bambini: 'elettronica', sport: 'gadget',
            bellezza: 'moda', cucina: 'casa'
        };
        const shopCat = catMap[deal.cat] || 'tutti';
        const shopLink = `${SHOP_URL}?cat=${shopCat}`;

        const text = `🔥 <b>OFFERTA DEL GIORNO!</b>

<b>${deal.title}</b>

💰 Solo <b>€ ${deal.price.toFixed(2)}</b>
❌ <s>€ ${deal.orig.toFixed(2)}</s>
📉 Sconto: <b>-${deal.discount}%</b>

🛒 <a href="${shopLink}">Vedi prodotti ${deal.cat} →</a>

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

    // Pubblica promo canale nei gruppi ogni 3 ore (quando i minuti dell'ora sono 0)
    if (GROUPS.length > 0) {
        const promoMsg = `📢 <b>Unisciti al nostro canale offerte!</b>

🔥 Ogni ora pubblichiamo offerte fino al <b>-90%</b> su:
📱 Elettronica | 👶 Bambini | 🏠 Casa | 👗 Moda | 🏋️ Sport

👉 <a href="https://t.me/dropshopofferte">t.me/dropshopofferte</a>
🛒 <a href="${SHOP_URL}">dropshop-italia.netlify.app</a>`;

        for (const groupId of GROUPS) {
            await sendTelegram(groupId, promoMsg);
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true, published: deals.length })
    };
};
