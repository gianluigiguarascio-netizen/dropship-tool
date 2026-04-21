/**
 * DropShop — CJDropshipping API Integration
 * Inoltro automatico ordini al fornitore
 */

const CJDropshipping = {
    baseUrl: '/api/cj-proxy',
    accessToken: null,
    tokenExpiry: null,

    getCredentials() {
        return JSON.parse(localStorage.getItem('dropshop_cj_credentials') || '{}');
    },

    isConfigured() {
        const creds = this.getCredentials();
        return !!(creds.email && creds.password);
    },

    async callProxy(endpoint, method = 'GET', body = null, token = null) {
        const res = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint, method, body, token })
        });
        return res.json();
    },

    async getAccessToken() {
        if (this.accessToken && this.tokenExpiry && new Date() < new Date(this.tokenExpiry)) {
            return this.accessToken;
        }

        const creds = this.getCredentials();
        if (!creds.email || !creds.password) {
            console.warn('[CJ] Credenziali non configurate');
            return null;
        }

        try {
            const data = await this.callProxy('/authentication/getAccessToken', 'POST', {
                email: creds.email, password: creds.password
            });

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

    async createOrder(order) {
        const token = await this.getAccessToken();
        if (!token) return { success: false, error: 'Token non disponibile' };

        const body = {
            orderNumber: order.id,
            shippingCountry: 'IT',
            shippingCustomerName: `${order.customer.firstName} ${order.customer.lastName}`,
            shippingPhone: order.customer.phone,
            shippingAddress: order.customer.address,
            shippingCity: order.customer.city,
            shippingProvince: order.customer.province,
            shippingZip: order.customer.cap,
            products: order.items.map(item => ({
                vid: item.sku || item.id,
                quantity: item.qty,
                shippingName: 'CJPacket'
            }))
        };

        try {
            const data = await this.callProxy('/shopping/order/createOrder', 'POST', body, token);
            if (data.result) {
                return { success: true, cjOrderId: data.data?.orderId };
            }
            return { success: false, error: data.message };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    async getOrderStatus(cjOrderId) {
        const token = await this.getAccessToken();
        if (!token) return null;
        try {
            const data = await this.callProxy(`/shopping/order/getOrderDetail?orderId=${cjOrderId}`, 'GET', null, token);
            return data.result ? data.data : null;
        } catch (err) { return null; }
    },

    async searchProducts(keyword, page = 1) {
        const token = await this.getAccessToken();
        if (!token) return [];
        try {
            const data = await this.callProxy(`/product/list?productName=${encodeURIComponent(keyword)}&pageNum=${page}&pageSize=20`, 'GET', null, token);
            return data.result ? (data.data?.list || []) : [];
        } catch (err) { return []; }
    }
};

window.CJDropshipping = CJDropshipping;
