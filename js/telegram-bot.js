/**
 * DropShop — Telegram Bot per Notifiche
 * Invia alert in tempo reale quando trova errori di prezzo
 *
 * SETUP:
 * 1. Cerca @BotFather su Telegram
 * 2. Invia /newbot e segui le istruzioni
 * 3. Copia il token del bot
 * 4. Avvia una chat con il tuo bot e invia /start
 * 5. Ottieni il tuo chat_id con: https://api.telegram.org/bot<TOKEN>/getUpdates
 * 6. Inserisci token e chat_id nelle impostazioni
 */

const TelegramBot = {
    token: '',
    chatId: '',
    baseUrl: 'https://api.telegram.org/bot',

    init() {
        const settings = JSON.parse(localStorage.getItem('dropshop_deal_settings') || '{}');
        this.token = settings.telegramToken || '';
        this.chatId = settings.telegramChatId || '';
    },

    isConfigured() {
        return this.token && this.chatId;
    },

    /**
     * Invia messaggio testuale
     */
    async sendMessage(text, parseMode = 'HTML') {
        if (!this.isConfigured()) {
            console.warn('[Telegram] Bot non configurato');
            return false;
        }

        try {
            const response = await fetch(`${this.baseUrl}${this.token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: text,
                    parse_mode: parseMode,
                    disable_web_page_preview: false
                })
            });
            const data = await response.json();
            return data.ok;
        } catch (err) {
            console.error('[Telegram] Errore invio:', err);
            return false;
        }
    },

    /**
     * Invia foto con caption
     */
    async sendPhoto(imageUrl, caption) {
        if (!this.isConfigured()) return false;

        try {
            const response = await fetch(`${this.baseUrl}${this.token}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    photo: imageUrl,
                    caption: caption,
                    parse_mode: 'HTML'
                })
            });
            const data = await response.json();
            return data.ok;
        } catch (err) {
            console.error('[Telegram] Errore foto:', err);
            return false;
        }
    },

    // ============================
    // ALERT TEMPLATES
    // ============================

    /**
     * Alert: Errore di Prezzo trovato!
     */
    async alertPriceError(deal) {
        const emoji = '🚨';
        const text = `${emoji} <b>ERRORE DI PREZZO!</b> ${emoji}

<b>${deal.title}</b>

💰 Prezzo attuale: <b>€ ${deal.currentPrice.toFixed(2)}</b>
❌ Prezzo originale: <s>€ ${deal.originalPrice.toFixed(2)}</s>
📉 Sconto: <b>-${deal.discount}%</b>

⭐ Rating: ${deal.rating}/5 (${deal.reviews} recensioni)
🏪 Fonte: ${deal.source.toUpperCase()}

💸 Profitto stimato: <b>+€ ${((deal.currentPrice * 1.6) - deal.currentPrice).toFixed(2)}</b>

🔗 <a href="${deal.url}">COMPRA ORA →</a>

⚡ <i>Sbrigati! Gli errori di prezzo durano poco!</i>`;

        if (deal.image) {
            return await this.sendPhoto(deal.image, text);
        }
        return await this.sendMessage(text);
    },

    /**
     * Alert: Offerta Hot (>70%)
     */
    async alertHotDeal(deal) {
        const text = `🔥 <b>OFFERTA IMPERDIBILE!</b>

<b>${deal.title}</b>

💰 Solo <b>€ ${deal.currentPrice.toFixed(2)}</b> (era € ${deal.originalPrice.toFixed(2)})
📉 Sconto: <b>-${deal.discount}%</b>
⭐ ${deal.rating}/5 • ${deal.source.toUpperCase()}

🔗 <a href="${deal.url}">Vedi Offerta →</a>`;

        return await this.sendMessage(text);
    },

    /**
     * Alert: Nuovo ordine ricevuto
     */
    async alertNewOrder(order) {
        const items = order.items.map(i => `  • ${i.name} x${i.qty}`).join('\n');
        const text = `🛒 <b>NUOVO ORDINE!</b>

📦 ID: <code>${order.id}</code>
👤 ${order.customer.firstName} ${order.customer.lastName}
📍 ${order.customer.city} (${order.customer.province})

Prodotti:
${items}

💰 Totale: <b>€ ${order.total.toFixed(2)}</b>
📧 ${order.customer.email}`;

        return await this.sendMessage(text);
    },

    /**
     * Alert: Riepilogo giornaliero
     */
    async alertDailySummary(stats) {
        const text = `📊 <b>RIEPILOGO GIORNALIERO</b>

🛒 Ordini oggi: <b>${stats.ordersToday}</b>
💰 Ricavi: <b>€ ${stats.revenueToday.toFixed(2)}</b>
📈 Profitto: <b>€ ${stats.profitToday.toFixed(2)}</b>

🔍 Offerte trovate: ${stats.dealsFound}
🚨 Errori prezzo: ${stats.errorsFound}
📥 Auto-importati: ${stats.autoImported}

📦 Prodotti in catalogo: ${stats.totalProducts}`;

        return await this.sendMessage(text);
    },

    /**
     * Alert: Prezzo tornato su (offerta scaduta)
     */
    async alertDealExpired(deal) {
        const text = `⏰ <b>Offerta scaduta</b>

${deal.title}
Il prezzo è tornato a € ${deal.originalPrice.toFixed(2)}

${deal.wasImported ? '✅ Già importato nel negozio' : '❌ Non importato'}`;

        return await this.sendMessage(text);
    },

    /**
     * Test connessione
     */
    async testConnection() {
        const text = `✅ <b>DropShop Bot Connesso!</b>

Il tuo bot è configurato correttamente.
Riceverai notifiche su:
• 🚨 Errori di prezzo
• 🔥 Offerte > 70%
• 🛒 Nuovi ordini
• 📊 Riepilogo giornaliero

Buone vendite! 🚀`;

        return await this.sendMessage(text);
    }
};

// ============================================
// MONITOR AUTOMATICO
// ============================================

const DealMonitor = {
    intervalId: null,
    checkInterval: 30 * 60 * 1000, // 30 minuti

    /**
     * Avvia monitoraggio continuo
     */
    start() {
        TelegramBot.init();
        Keepa.init();

        if (!TelegramBot.isConfigured()) {
            console.log('[Monitor] Telegram non configurato, alert solo in dashboard');
        }

        // Prima esecuzione
        this.check();

        // Ripeti ogni 30 minuti
        this.intervalId = setInterval(() => this.check(), this.checkInterval);
        console.log('[Monitor] Avviato — check ogni 30 minuti');
    },

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('[Monitor] Fermato');
        }
    },

    /**
     * Esegui un ciclo di controllo
     */
    async check() {
        const settings = JSON.parse(localStorage.getItem('dropshop_deal_settings') || '{}');
        const errorThreshold = parseInt(settings.errorThreshold || 80);

        try {
            // 1. Controlla Keepa per nuovi deals
            if (Keepa.apiKey) {
                const deals = await Keepa.getDeals(8, {
                    minDropPercent: -99,
                    maxDropPercent: -(parseInt(settings.minDiscount || 50)),
                    minPrice: 100,  // €1 minimo
                    maxPrice: (parseInt(settings.maxPrice || 30)) * 100
                });

                for (const deal of deals) {
                    if (deal.isError || Math.abs(deal.dropPercent) >= errorThreshold) {
                        await this.handleNewDeal(deal, true);
                    } else if (Math.abs(deal.dropPercent) >= 70) {
                        await this.handleNewDeal(deal, false);
                    }
                }
            }

            // 2. Controlla watchlist
            const watchlist = JSON.parse(localStorage.getItem('dropshop_watchlist') || '[]');
            if (watchlist.length > 0 && Keepa.apiKey) {
                const alerts = await Keepa.monitorWatchlist(watchlist);
                for (const alert of alerts) {
                    await TelegramBot.sendMessage(
                        `🎯 <b>PREZZO RAGGIUNTO!</b>\n\n${alert.title}\n💰 € ${alert.currentPrice.toFixed(2)} (target: € ${alert.targetPrice.toFixed(2)})\n📉 -${alert.drop}% dal prezzo medio\n\n<a href="https://amazon.it/dp/${alert.asin}">Compra →</a>`
                    );
                }
            }

            this.logCheck('success');
        } catch (err) {
            console.error('[Monitor] Errore:', err);
            this.logCheck('error', err.message);
        }
    },

    async handleNewDeal(deal, isError) {
        // Evita duplicati
        const existing = JSON.parse(localStorage.getItem('dropshop_deals') || '[]');
        if (existing.find(d => d.asin === deal.asin)) return;

        // Aggiungi alla lista deals
        const newDeal = {
            id: 'd-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            source: 'amazon',
            asin: deal.asin,
            title: deal.title,
            image: deal.image,
            originalPrice: deal.previousPrice,
            currentPrice: deal.currentPrice,
            discount: Math.abs(deal.dropPercent),
            rating: 4.0,
            reviews: 0,
            category: 'electronics',
            url: deal.url,
            foundAt: new Date().toISOString(),
            isError
        };

        existing.unshift(newDeal);
        if (existing.length > 50) existing.pop();
        localStorage.setItem('dropshop_deals', JSON.stringify(existing));

        // Invia alert Telegram
        if (TelegramBot.isConfigured()) {
            if (isError) {
                await TelegramBot.alertPriceError(newDeal);
            } else {
                await TelegramBot.alertHotDeal(newDeal);
            }
        }

        // Auto-import se configurato
        const settings = JSON.parse(localStorage.getItem('dropshop_deal_settings') || '{}');
        if (settings.autoImport === 'errors' && isError) {
            this.autoImport(newDeal);
        } else if (settings.autoImport === 'hot' && newDeal.discount >= 70) {
            this.autoImport(newDeal);
        } else if (settings.autoImport === 'all') {
            this.autoImport(newDeal);
        }
    },

    autoImport(deal) {
        const settings = JSON.parse(localStorage.getItem('dropshop_deal_settings') || '{}');
        const markup = parseFloat(settings.dealMarkup || 60);
        const sellPrice = parseFloat((deal.currentPrice * (1 + markup / 100)).toFixed(2));

        const product = {
            id: 'imp-' + Date.now(),
            name: deal.title,
            category: 'elettronica',
            supplierPrice: deal.currentPrice,
            price: sellPrice,
            originalPrice: deal.originalPrice,
            image: deal.image,
            images: [],
            description: `${deal.title}. Offerta speciale -${deal.discount}%.`,
            rating: deal.rating || 4.0,
            reviews: deal.reviews || 0,
            badge: deal.isError ? 'ERRORE PREZZO' : `-${deal.discount}%`,
            stock: 30,
            sku: deal.asin || deal.id,
            importedFrom: deal.source,
            importedAt: new Date().toISOString()
        };

        const products = JSON.parse(localStorage.getItem('dropshop_products') || '[]');
        products.unshift(product);
        localStorage.setItem('dropshop_products', JSON.stringify(products));

        // Log
        const imported = JSON.parse(localStorage.getItem('dropshop_imported_deals') || '[]');
        imported.push({ ...deal, sellPrice, profit: sellPrice - deal.currentPrice, importedAt: new Date().toISOString() });
        localStorage.setItem('dropshop_imported_deals', JSON.stringify(imported));
    },

    logCheck(status, error = null) {
        const log = JSON.parse(localStorage.getItem('dropshop_monitor_log') || '[]');
        log.push({ timestamp: new Date().toISOString(), status, error });
        if (log.length > 100) log.splice(0, log.length - 100);
        localStorage.setItem('dropshop_monitor_log', JSON.stringify(log));
    }
};
