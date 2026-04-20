const ReviewManager = {
    storageKey: 'dropship_reviews',

    getAll() {
        try { return JSON.parse(localStorage.getItem(this.storageKey) || '[]'); }
        catch { return []; }
    },

    saveAll(reviews) {
        localStorage.setItem(this.storageKey, JSON.stringify(reviews));
    },

    init() {
        if (!localStorage.getItem(this.storageKey)) {
            this.saveAll([]);
        }
    },

    addReview(productId, data) {
        const reviews = this.getAll();
        const review = {
            id: 'rev-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
            productId,
            author: (data.author || '').trim(),
            email: (data.email || '').trim(),
            rating: Math.max(1, Math.min(5, parseInt(data.rating || 5, 10))),
            title: (data.title || '').trim(),
            body: (data.body || '').trim(),
            createdAt: new Date().toISOString(),
            status: 'pending',
            verified: !!data.verified,
            orderId: data.orderId || ''
        };
        reviews.push(review);
        this.saveAll(reviews);
        return review;
    },

    approveReview(reviewId) {
        const reviews = this.getAll();
        const review = reviews.find(r => r.id === reviewId);
        if (!review) return false;
        review.status = 'approved';
        review.approvedAt = new Date().toISOString();
        this.saveAll(reviews);
        return true;
    },

    rejectReview(reviewId) {
        const reviews = this.getAll();
        const review = reviews.find(r => r.id === reviewId);
        if (!review) return false;
        review.status = 'rejected';
        review.rejectedAt = new Date().toISOString();
        this.saveAll(reviews);
        return true;
    },

    getProductReviews(productId, status = 'approved') {
        return this.getAll()
            .filter(r => r.productId === productId && (status === 'all' || r.status === status))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    getPendingReviews() {
        return this.getAll()
            .filter(r => r.status === 'pending')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    getProductRating(productId) {
        const approved = this.getProductReviews(productId, 'approved');
        if (!approved.length) return { rating: 0, count: 0 };
        const total = approved.reduce((sum, r) => sum + Number(r.rating || 0), 0);
        return { rating: +(total / approved.length).toFixed(1), count: approved.length };
    },

    hasVerifiedPurchase(productId, email) {
        const orders = JSON.parse(localStorage.getItem('dropship_orders') || '[]');
        return orders.some(order =>
            order?.customer?.email?.toLowerCase() === String(email || '').toLowerCase() &&
            (order.items || []).some(item => item.id === productId)
        );
    }
};

document.addEventListener('DOMContentLoaded', () => {
    try { ReviewManager.init(); } catch (e) {}
})
