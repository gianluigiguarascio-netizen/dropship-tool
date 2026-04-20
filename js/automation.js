/**
 * DropShop — Sistema Automazione
 * Gestisce: inoltro ordini al fornitore, tracking, email, sync prezzi
 */

const Automation = {

    // ===========================
    // 1. INOLTRO ORDINE A CJDROPSHIPPING
    // ===========================
    async forwardOrderToSupplier(order) {
        const settings = JSON.parse(localStorage.getItem('dropshop_settings') || '{}');
        const apiKey = settings.cjKey;

        if (!apiKey) {
            console.warn('[Automation] CJ API key mancante. Ordine non inoltrato.');
            this.logEvent('order_forward_failed', order.id, 'API key mancante');
            return { success: false, error: 'API key mancante' };
        }

        // Prepara payload per CJDropshipping
        const payload = {
            orderNumber: order.id,
            shippingZip: order.customer.cap,
            shippingCountryCode: 'IT',
            shippingProvince: order.customer.province,
            shippingCity: order.customer.city,
            shippingAddress: order.customer.address,
            shippingCustomerName: `${order.customer.firstName} ${order.customer.lastName}`,
            shippingPhone: order.customer.phone,
            products: order.items.map(item => {
                const product = this.getProductBySku(item.id);
                return {
                    vid: product?.sku || '',
                    quantity: item.qty
                };
            })
        };

        try {
            // In produzione: chiamata reale all'API CJDropshipping
            // POST https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrder
            const response = await this.callCJApi('/shopping/order/createOrder', payload, apiKey);

            if (response.success) {
                this.updateOrderStatus(order.id, 'processing');
                this.logEvent('order_forwarded', order.id, `CJ Order: ${response.data?.orderId}`);
                return { success: true, cjOrderId: response.data?.orderId };
            } else {
                this.logEvent('order_forward_failed', order.id, response.message);
                return { success: false, error: response.message };
            }
        } catch (err) {
            this.logEvent('order_forward_error', order.id, err.message);
            return { success: false, error: err.message };
        }
    },

    // ===========================
    // 2. TRACKING SPEDIZIONE
    // ===========================
    async getTrackingInfo(trackingNumber) {
        const settings = JSON.parse(localStorage.getItem('dropshop_settings') || '{}');
        const apiKey = settings.cjKey;

        if (!apiKey || !trackingNumber) return null;

        try {
            const response = await this.callCJApi(`/logistics/getTrackInfo?trackNumber=${trackingNumber}`, null, apiKey, 'GET');
            if (response.success) {
                return response.data;
            }
        } catch (err) {
            console.error('[Tracking]', err);
        }
        return null;
    },

    // Aggiorna tracking di tutti gli ordini spediti
    async syncAllTracking() {
        const orders = JSON.parse(localStorage.getItem('dropshop_orders') || '[]');
        const shippedOrders = orders.filter(o => o.status === 'shipped' && o.trackingNumber);

        for (const order of shippedOrders) {
            const info = await this.getTrackingInfo(order.trackingNumber);
            if (info && info.delivered) {
                this.updateOrderStatus(order.id, 'delivered');
                await this.sendEmail(order, 'delivered');
            }
        }

        this.logEvent('tracking_sync', null, `${shippedOrders.length} ordini verificati`);
    },

    // ===========================
    // 3. SYNC PREZZI E DISPONIBILITÀ
    // ===========================
    async syncProductPrices() {
        const settings = JSON.parse(localStorage.getItem('dropshop_settings') || '{}');
        const apiKey = settings.cjKey;
        const markup = parseFloat(settings.markup || 40);

        if (!apiKey) return;

        const products = JSON.parse(localStorage.getItem('dropshop_products') || '[]');
        let updated = 0;

        for (const product of products) {
            if (!product.sku) continue;

            try {
                const response = await this.callCJApi(`/product/query?pid=${product.sku}`, null, apiKey, 'GET');
                if (response.success && response.data) {
                    const newCost = response.data.sellPrice || product.supplierPrice;
                    const newStock = response.data.stock || 0;

                    if (newCost !== product.supplierPrice || newStock !== product.stock) {
                        product.supplierPrice = newCost;
                        product.price = parseFloat((newCost * (1 + markup / 100)).toFixed(2));
                        product.stock = newStock;
                        updated++;
                    }
                }
            } catch (err) {
                console.error(`[Sync] Errore prodotto ${product.sku}:`, err);
            }
        }

        if (updated > 0) {
            localStorage.setItem('dropshop_products', JSON.stringify(products));
            this.logEvent('price_sync', null, `${updated} prodotti aggiornati`);
        }

        return updated;
    },

    // ===========================
    // 4. EMAIL AUTOMATICHE
    // ===========================
    async sendEmail(order, type) {
        const settings = JSON.parse(localStorage.getItem('dropshop_settings') || '{}');

        // Template email
        const templates = {
            confirmation: {
                subject: `Ordine ${order.id} confermato!`,
                body: this.getEmailTemplate('confirmation', order)
            },
            shipped: {
                subject: `Il tuo ordine ${order.id} è stato spedito!`,
                body: this.getEmailTemplate('shipped', order)
            },
            delivered: {
                subject: `Ordine ${order.id} consegnato!`,
                body: this.getEmailTemplate('delivered', order)
            }
        };

        const template = templates[type];
        if (!template) return;

        // Metodo 1: EmailJS (gratuito, lato client)
        if (settings.emailServiceId && settings.emailPublicKey) {
            try {
                // emailjs.send() - richiede inclusione script EmailJS
                if (typeof emailjs !== 'undefined') {
                    await emailjs.send(settings.emailServiceId, settings.emailTemplateId, {
                        to_email: order.customer.email,
                        to_name: `${order.customer.firstName} ${order.customer.lastName}`,
                        subject: template.subject,
                        message: template.body,
                        order_id: order.id
                    });
                    this.logEvent('email_sent', order.id, `Tipo: ${type}`);
                }
            } catch (err) {
                this.logEvent('email_failed', order.id, err.message);
            }
        }

        // Salva email nel log comunque
        const emailLog = JSON.parse(localStorage.getItem('dropshop_emails') || '[]');
        emailLog.push({
            date: new Date().toISOString(),
            orderId: order.id,
            to: order.customer.email,
            type,
            subject: template.subject
        });
        localStorage.setItem('dropshop_emails', JSON.stringify(emailLog));
    },

    getEmailTemplate(type, order) {
        const itemsList = order.items.map(i => `• ${i.name} x${i.qty} — € ${(i.price * i.qty).toFixed(2)}`).join('\n');

        const templates = {
            confirmation: `
Ciao ${order.customer.firstName},

Grazie per il tuo ordine su DropShop! 🎉

📦 Riepilogo Ordine #${order.id}:
${itemsList}

💰 Totale: € ${order.total.toFixed(2)}
📍 Spedizione a: ${order.customer.address}, ${order.customer.city} ${order.customer.cap}

Ti invieremo un'email quando il pacco sarà spedito.

Grazie per aver scelto DropShop!
Il Team DropShop`,

            shipped: `
Ciao ${order.customer.firstName},

Ottime notizie! Il tuo ordine #${order.id} è stato spedito! 🚀

📦 Tracking: ${order.trackingNumber || 'In elaborazione'}
🔗 Segui il pacco: ${order.trackingUrl || 'Ti aggiorneremo presto'}

Tempo di consegna stimato: 5-12 giorni lavorativi.

Il Team DropShop`,

            delivered: `
Ciao ${order.customer.firstName},

Il tuo ordine #${order.id} è stato consegnato! 📬

Speriamo che i prodotti siano di tuo gradimento!
Se hai domande o problemi, non esitare a contattarci.

⭐ Lascia una recensione sul nostro sito!

Il Team DropShop`
        };

        return templates[type] || '';
    },

    // ===========================
    // 5. WORKFLOW AUTOMATICO POST-ORDINE
    // ===========================
    async processNewOrder(order) {
        // Step 1: Invia email di conferma
        await this.sendEmail(order, 'confirmation');

        // Step 2: Inoltra ordine al fornitore
        const result = await this.forwardOrderToSupplier(order);

        // Step 3: Aggiorna stato
        if (result.success) {
            this.updateOrderStatus(order.id, 'paid');
            // Salva CJ order ID
            const orders = JSON.parse(localStorage.getItem('dropshop_orders') || '[]');
            const idx = orders.findIndex(o => o.id === order.id);
            if (idx >= 0) {
                orders[idx].cjOrderId = result.cjOrderId;
                localStorage.setItem('dropshop_orders', JSON.stringify(orders));
            }
        }

        return result;
    },

    // ===========================
    // UTILITY
    // ===========================
    async callCJApi(endpoint, body, apiKey, method = 'POST') {
        const baseUrl = 'https://developers.cjdropshipping.com/api2.0/v1';
        const options = {
            method,
            headers: {
                'CJ-Access-Token': apiKey,
                'Content-Type': 'application/json'
            }
        };
        if (body && method === 'POST') {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${baseUrl}${endpoint}`, options);
        return response.json();
    },

    getProductBySku(productId) {
        const products = JSON.parse(localStorage.getItem('dropshop_products') || '[]');
        return products.find(p => p.id === productId);
    },

    updateOrderStatus(orderId, status) {
        const orders = JSON.parse(localStorage.getItem('dropshop_orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            order.updatedAt = new Date().toISOString();
            localStorage.setItem('dropshop_orders', JSON.stringify(orders));
        }
    },

    logEvent(type, orderId, details) {
        const log = JSON.parse(localStorage.getItem('dropshop_automation_log') || '[]');
        log.push({
            timestamp: new Date().toISOString(),
            type,
            orderId,
            details
        });
        // Mantieni solo ultimi 200 log
        if (log.length > 200) log.splice(0, log.length - 200);
        localStorage.setItem('dropshop_automation_log', JSON.stringify(log));
    },

    // ===========================
    // CRON-LIKE: Esegui periodicamente
    // ===========================
    startAutoSync(intervalMinutes = 60) {
        // Sync tracking ogni ora
        setInterval(() => this.syncAllTracking(), intervalMinutes * 60 * 1000);
        // Sync prezzi ogni 6 ore
        setInterval(() => this.syncProductPrices(), 6 * 60 * 60 * 1000);
        console.log(`[Automation] Auto-sync avviato: tracking ogni ${intervalMinutes}min, prezzi ogni 6h`);
    }
};
