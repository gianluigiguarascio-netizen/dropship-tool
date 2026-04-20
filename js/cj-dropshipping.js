/**
 * DropShop — CJDropshipping API Integration
 * Inoltro automatico ordini al fornitore
 */

const CJDropshipping = {
    baseUrl: 'https://developers.cjdropshipping.com/api2.0/v1',
    accessToken: null,
    tokenExpiry: null,

    getCredentials() {
        return JSON.parse(localStorage.getItem('dropshop_cj_credentials') || '{}');
    },

    isConfigured() {
        const creds = this.getCredentials();
        return !!(creds.email && creds.password);
    },

    async getAccessToken() {
        // Riusa token se ancora valido
        if (this.accessToken && this.tokenExpiry && new Date() < new Date(this.tokenExpiry)) {
            return this.accessToken;
        }

        const creds = this.getCredentials();
        if (!creds.email || !creds.password) {
            console.warn('[CJ] Credenziali non configurate');
            return null;
        }

        try {
            const res = await fetch(`${this.baseUrl}/authentication/getAccessToken`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: creds.email, password: creds.password })
            });
            const data = await res.json();

            if (data.result && data.data?.accessToken) {
                this.accessToken = data.data.accessToken;
                this.tokenExpiry = data.data.accessTokenExpiryDate;
                return this.accessToken;
            }
            console.warn('[CJ] Login fallito:', data.message);
            return null;
        } catch (err) {
            console.error('[CJ] Errore token:', err.message);
            return null;
        }
    },

    // Crea ordine su CJDropshipping
    async createOrder(order) {
        const token = await this.getAccessToken();
        if (!token) return { success: false, error: 'Token non disponibile' };

        const products = order.items.map(item => ({
            vid: item.sku || item.id,
            quantity: item.qty,
            shippingName: 'CJPacket'
        }));

        const body = {
            orderNumber: order.id,
            shippingCountry: 'IT',
            shippingCustomerName: `${order.customer.firstName} ${order.customer.lastName}`,
            shippingPhone: order.customer.phone,
            shippingAddress: order.customer.address,
            shippingCity: order.customer.city,
            shippingProvince: order.customer.province,
            shippingZip: order.customer.cap,
            products
        };

        try {
            const res = await fetch(`${this.baseUrl}/shopping/order/createOrder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CJ-Access-Token': token
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (data.result) {
                console.log('[CJ] Ordine creato:', data.data?.orderId);
                return { success: true, cjOrderId: data.data?.orderId };
            }
            return { success: false, error: data.message };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    // Controlla stato spedizione
    async getOrderStatus(cjOrderId) {
        const token = await this.getAccessToken();
        if (!token) return null;

        try {
            const res = await fetch(`${this.baseUrl}/shopping/order/getOrderDetail?orderId=${cjOrderId}`, {
                headers: { 'CJ-Access-Token': token }
            });
            const data = await res.json();
            return data.result ? data.data : null;
        } catch (err) {
            return null;
        }
    },

    // Cerca prodotti su CJ
    async searchProducts(keyword, page = 1) {
        const token = await this.getAccessToken();
        if (!token) return [];

        try {
            const res = await fetch(`${this.baseUrl}/product/list?productName=${encodeURIComponent(keyword)}&pageNum=${page}&pageSize=20`, {
                headers: { 'CJ-Access-Token': token }
            });
            const data = await res.json();
            return data.result ? (data.data?.list || []) : [];
        } catch (err) {
            return [];
        }
    }
};

window.CJDropshipping = CJDropshipping;
