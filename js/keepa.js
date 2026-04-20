/**
 * DropShop — Integrazione Keepa
 * Storico prezzi Amazon, alert calo prezzo, rilevamento errori
 * API: https://keepa.com/#!discuss/t/using-the-keepa-api/47
 */

const Keepa = {
    baseUrl: 'https://api.keepa.com',
    apiKey: '', // Inserisci la tua Keepa API key

    init() {
        const settings = JSON.parse(localStorage.getItem('dropshop_deal_settings') || '{}');
        this.apiKey = settings.keepaKey || '';
    },

    /**
     * Cerca prodotto per ASIN e ottieni storico prezzi
     * @param {string} asin - Amazon ASIN (es: B0XXXXXXXXX)
     * @param {string} domain - Dominio Amazon (8 = Italia, 4 = Germania, 3 = UK, 1 = USA)
     */
    async getProduct(asin, domain = 8) {
        if (!this.apiKey) {
            console.warn('[Keepa] API key mancante');
            return null;
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/product?key=${this.apiKey}&domain=${domain}&asin=${asin}&history=1&stats=180`
            );
            const data = await response.json();

            if (data.products && data.products.length > 0) {
                return this.parseProduct(data.products[0]);
            }
        } catch (err) {
            console.error('[Keepa] Errore:', err);
        }
        return null;
    },

    /**
     * Cerca prodotti per keyword
     */
    async search(keyword, domain = 8, category = null) {
        if (!this.apiKey) return [];

        try {
            const params = new URLSearchParams({
                key: this.apiKey,
                domain: domain,
                type: 'product',
                term: keyword,
                perPage: 20
            });

            if (category) params.append('rootCategory', category);

            const response = await fetch(`${this.baseUrl}/search?${params}`);
            const data = await response.json();

            if (data.products) {
                return data.products.map(p => this.parseProduct(p));
            }
        } catch (err) {
            console.error('[Keepa] Errore ricerca:', err);
        }
        return [];
    },

    /**
     * Ottieni prodotti con maggior calo di prezzo
     * "Deal" endpoint di Keepa
     */
    async getDeals(domain = 8, options = {}) {
        if (!this.apiKey) return [];

        const dealRequest = {
            page: options.page || 0,
            domainId: domain,
            excludeCategories: [],
            includeCategories: options.categories || [],
            priceTypes: [0], // 0 = Amazon price
            deltaRange: [options.minDrop || -90, options.maxDrop || -50], // % drop
            deltaPercentRange: [options.minDropPercent || -95, options.maxDropPercent || -50],
            currentRange: [options.minPrice || 100, options.maxPrice || 10000], // In centesimi
            isRangeEnabled: true,
            isFilterEnabled: true,
            hasReviews: true,
            sortType: 3, // Sort by drop %
            dateRange: [0, 0] // Any time
        };

        try {
            const response = await fetch(`${this.baseUrl}/deal?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dealRequest)
            });
            const data = await response.json();

            if (data.deals && data.deals.dr) {
                return data.deals.dr.map(d => this.parseDeal(d, domain));
            }
        } catch (err) {
            console.error('[Keepa] Errore deals:', err);
        }
        return [];
    },

    /**
     * Controlla se un prezzo è un errore (anomalia vs storico)
     */
    async isPriceError(asin, currentPrice, domain = 8) {
        const product = await this.getProduct(asin, domain);
        if (!product) return { isError: false, confidence: 0 };

        const avgPrice = product.stats.avg90;
        const minPrice = product.stats.min90;
        const maxPrice = product.stats.max90;

        // Se il prezzo è < 20% del prezzo medio degli ultimi 90 giorni = probabile errore
        const ratio = currentPrice / avgPrice;
        const isError = ratio < 0.2; // Sotto il 20% del prezzo medio
        const isSuspicious = ratio < 0.35; // Sotto il 35% = sospetto

        return {
            isError,
            isSuspicious,
            confidence: isError ? 95 : (isSuspicious ? 70 : 30),
            avgPrice,
            minPrice,
            maxPrice,
            dropPercent: Math.round((1 - ratio) * 100),
            priceHistory: product.priceHistory
        };
    },

    /**
     * Monitora lista ASIN e notifica cali di prezzo
     */
    async monitorWatchlist(watchlist) {
        const alerts = [];

        for (const item of watchlist) {
            const product = await this.getProduct(item.asin);
            if (!product) continue;

            const currentPrice = product.currentPrice;
            if (currentPrice > 0 && currentPrice < item.targetPrice) {
                alerts.push({
                    asin: item.asin,
                    title: product.title,
                    currentPrice,
                    targetPrice: item.targetPrice,
                    avgPrice: product.stats.avg90,
                    drop: Math.round((1 - currentPrice / product.stats.avg90) * 100)
                });
            }
        }

        return alerts;
    },

    // ========== PARSING ==========

    parseProduct(raw) {
        const amazonPrice = this.getLatestPrice(raw.csv?.[0]); // csv[0] = Amazon price
        const marketplacePrice = this.getLatestPrice(raw.csv?.[1]); // csv[1] = Marketplace

        return {
            asin: raw.asin,
            title: raw.title,
            image: raw.imagesCSV ? `https://images-na.ssl-images-amazon.com/images/I/${raw.imagesCSV.split(',')[0]}` : '',
            currentPrice: amazonPrice / 100, // Keepa usa centesimi
            marketplacePrice: marketplacePrice / 100,
            rating: raw.csv?.[16] ? raw.csv[16][raw.csv[16].length - 1] / 10 : 0,
            reviews: raw.csv?.[17] ? raw.csv[17][raw.csv[17].length - 1] : 0,
            category: raw.categoryTree?.[0]?.name || '',
            stats: {
                avg90: (raw.stats?.avg?.[0] || 0) / 100,
                min90: (raw.stats?.min?.[0] || 0) / 100,
                max90: (raw.stats?.max?.[0] || 0) / 100,
                avg180: (raw.stats?.avg180?.[0] || 0) / 100
            },
            priceHistory: this.parsePriceHistory(raw.csv?.[0]),
            url: `https://www.amazon.it/dp/${raw.asin}`,
            lastUpdate: raw.lastUpdate ? new Date(raw.lastUpdate * 60000 + 21564000 * 60000) : null
        };
    },

    parseDeal(raw, domain) {
        const domainMap = { 1: 'com', 3: 'co.uk', 4: 'de', 8: 'it', 9: 'fr', 10: 'es' };
        const tld = domainMap[domain] || 'it';

        return {
            asin: raw.asin,
            title: raw.title || 'Prodotto Amazon',
            currentPrice: (raw.current || 0) / 100,
            previousPrice: (raw.avg || 0) / 100,
            dropPercent: raw.deltaPercent || 0,
            category: raw.categoryName || '',
            image: raw.image ? `https://images-na.ssl-images-amazon.com/images/I/${raw.image}` : '',
            url: `https://www.amazon.${tld}/dp/${raw.asin}`,
            isError: Math.abs(raw.deltaPercent || 0) >= 80
        };
    },

    getLatestPrice(csv) {
        if (!csv || csv.length < 2) return 0;
        // Il formato csv di Keepa è [time, price, time, price, ...]
        return csv[csv.length - 1] || 0;
    },

    parsePriceHistory(csv) {
        if (!csv) return [];
        const history = [];
        for (let i = 0; i < csv.length; i += 2) {
            if (csv[i + 1] > 0) {
                history.push({
                    date: new Date((csv[i] + 21564000) * 60000),
                    price: csv[i + 1] / 100
                });
            }
        }
        return history;
    },

    /**
     * Genera grafico prezzi semplice (ASCII per console o HTML sparkline)
     */
    getPriceChart(priceHistory, width = 30) {
        if (!priceHistory || priceHistory.length < 2) return '';
        const prices = priceHistory.slice(-width).map(h => h.price);
        const max = Math.max(...prices);
        const min = Math.min(...prices);
        const range = max - min || 1;

        return prices.map(p => {
            const height = Math.round(((p - min) / range) * 7);
            return ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'][height];
        }).join('');
    }
};
