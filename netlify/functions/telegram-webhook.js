/**
 * Netlify Function — Telegram Webhook
 * Gestisce messaggi in arrivo al bot e risponde automaticamente
 */

const TELEGRAM_TOKEN = '8548180810:AAEs1LTBMOXXiibvgQXfhUZoqtf8rm9qKpg';
const CHANNEL = '@dropshopofferte';
const SHOP_URL = 'https://dropship-tool-ecru.vercel.app';

async function sendMessage(chatId, text, keyboard = null) {
    const body = {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false
    };
    if (keyboard) body.reply_markup = keyboard;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 200, body: 'OK' };
    }

    try {
        const update = JSON.parse(event.body);
        const message = update.message || update.channel_post;
        if (!message) return { statusCode: 200, body: 'OK' };

        const chatId = message.chat.id;
        const text = message.text || '';
        const firstName = message.from?.first_name || 'amico';

        // Comando /start
        if (text.startsWith('/start')) {
            await sendMessage(chatId, `👋 Ciao <b>${firstName}</b>! Benvenuto su <b>DropShop Italia</b>! 🛒

Ogni giorno pubblichiamo le migliori offerte su elettronica, bambini, casa e tanto altro — fino al <b>-90% di sconto</b>!

📢 Unisciti al nostro canale offerte:
👉 <b>t.me/dropshopofferte</b>

🛍️ Visita il negozio:
👉 <b>${SHOP_URL}</b>

Condividi con i tuoi amici e aiutali a risparmiare! 💸`, {
                inline_keyboard: [[
                    { text: '📢 Vai al Canale Offerte', url: `https://t.me/dropshopofferte` }
                ], [
                    { text: '🛒 Visita il Negozio', url: SHOP_URL }
                ], [
                    { text: '📤 Condividi con un Amico', switch_inline_query: `Guarda queste offerte pazzesche! Risparmia fino al -90% su DropShop Italia 🛒 ${SHOP_URL} | Canale offerte: t.me/dropshopofferte` }
                ]]
            });
        }

        // Comando /offerte
        else if (text.startsWith('/offerte')) {
            await sendMessage(chatId, `🔥 <b>OFFERTE DEL MOMENTO</b>

Le migliori offerte aggiornate ogni ora ti aspettano sul canale!

📢 <a href="https://t.me/dropshopofferte">@dropshopofferte</a>

Clicca sul link e premi <b>Iscriviti</b> per non perderti nessuna offerta! 🚀`);
        }

        // Comando /condividi
        else if (text.startsWith('/condividi')) {
            await sendMessage(chatId, `📤 <b>Condividi DropShop con i tuoi amici!</b>

Copia e incolla questo messaggio:

<code>🔥 Ho trovato un negozio con offerte pazzesche fino al -90%!

📢 Canale offerte Telegram: t.me/dropshopofferte
🛒 Negozio: ${SHOP_URL}

Ogni ora nuove offerte su elettronica, bambini, casa e tanto altro! 🛍️</code>`);
        }

        // Qualsiasi altro messaggio
        else if (message.chat.type === 'private') {
            await sendMessage(chatId, `Ciao <b>${firstName}</b>! 👋

Usa questi comandi:
/start — Benvenuto e link canale
/offerte — Vedi le offerte del momento
/condividi — Messaggio da condividere con amici

📢 Canale: <a href="https://t.me/dropshopofferte">@dropshopofferte</a>
🛒 Negozio: <a href="${SHOP_URL}">dropshop-italia.netlify.app</a>`);
        }

    } catch (err) {
        console.error('[Webhook]', err);
    }

    return { statusCode: 200, body: 'OK' };
};
