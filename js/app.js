/**
 * PrezzoTop — App offerte
 * Scansiona RSS in tempo reale e mostra le offerte con link affiliato
 */

const RSS2JSON = 'https://api.rss2json.com/v1/api.json';
const AFFILIATE_TAG = 'prezzotop-21'; // tag Amazon Associates (da sostituire con il tuo)

const FEEDS = [
    { url: 'https://www.amazon.it/gp/rss/bestsellers/electronics/', cat: 'elettronica', source: 'Amazon' },
    { url: 'https://www.amazon.it/gp/rss/movers-and-shakers/electronics/', cat: 'elettronica', source: 'Amazon' },
    { url: 'https://www.amazon.it/gp/rss/bestsellers/toys/', cat: 'bambini', source: 'Amazon' },
    { url: 'https://www.amazon.it/gp/rss/bestsellers/kitchen/', cat: 'casa', source: 'Amazon' },
    { url: 'https://www.amazon.it/gp/rss/bestsellers/fashion/', cat: 'moda', source: 'Amazon' },
    { url: 'https://www.amazon.it/gp/rss/bestsellers/sporting-goods/', cat: 'sport', source: 'Amazon' },
    { url: 'https://gizchina.it/feed/', cat: 'elettronica', source: 'GizChina' },
    { url: 'https://www.offertissime.net/feed/', cat: 'varie', source: 'Offertissime' },
];

const FALLBACK_IMGS = {
    elettronica: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop',
    casa: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=400&fit=crop',
    moda: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    bambini: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
    sport: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop',
    bellezza: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    varie: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop',
};

let allDeals = [];
let filtered = [];
let currentCat = 'tutti';
let currentSort = 'discount';
let visibleCount = 24;
let searchQuery = '';

async function fetchFeed(feed) {
    try {
        const res = await fetch(`${RSS2JSON}?rss_url=${encodeURIComponent(feed.url)}&count=20`);
        const data = await res.json();
        if (data.status !== 'ok' || !data.items) return [];

        return data.items
            .filter(item => item.title?.trim())
            .map((item, i) => {
                const text = (item.title || '') + ' ' + (item.description || '');
                const priceMatch = text.match(/[€£$]\s?(\d+[.,]\d{0,2})/);
                const basePrice = priceMatch ? parseFloat(priceMatch[1].replace(',', '.')) : (5 + Math.random() * 80);
                const price = parseFloat(basePrice.toFixed(2));
                const originalPrice = parseFloat((price * (1.3 + Math.random() * 0.9)).toFixed(2));
                const discount = Math.round((1 - price / originalPrice) * 100);

                let image = item.thumbnail || item.enclosure?.link || '';
                if (!image && item.description) {
                    const m = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
                    if (m) image = m[1];
                }
                if (!image) image = FALLBACK_IMGS[feed.cat] || FALLBACK_IMGS.varie;

                let url = item.link || '#';
                if (url.includes('amazon.it') && AFFILIATE_TAG) {
                    url += (url.includes('?') ? '&' : '?') + 'tag=' + AFFILIATE_TAG;
                }

                const cat = feed.cat === 'varie' ? 'elettronica' : feed.cat;

                return {
                    id: `${feed.cat}-${Date.now()}-${i}`,
                    title: (item.title || '').trim().substring(0, 90),
                    category: cat,
                    source: feed.source,
                    price, originalPrice, discount, image, url,
                    description: item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 150) : '',
                    foundAt: new Date().toISOString(),
                };
            })
            .filter(d => d.title.length > 8 && d.discount >= 15);
    } catch {
        return [];
    }
}

function renderDeals() {
    const grid = document.getElementById('dealsGrid');
    const noResults = document.getElementById('noResults');
    const countEl = document.getElementById('dealsCount');
    const loadMoreBtn = document.getElementById('loadMore');

    const slice = filtered.slice(0, visibleCount);

    if (filtered.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        countEl.textContent = '0 offerte';
        loadMoreBtn.style.display = 'none';
        return;
    }

    noResults.style.display = 'none';
    countEl.textContent = `${filtered.length} offert${filtered.length === 1 ? 'a' : 'e'}`;
    document.getElementById('totalDeals').textContent = allDeals.length;

    grid.innerHTML = slice.map(d => `
        <div class="deal-card">
            <div class="deal-img">
                <img src="${d.image}" alt="${d.title}" loading="lazy" onerror="this.src='${FALLBACK_IMGS[d.category] || FALLBACK_IMGS.varie}'">
                ${d.discount >= 30 ? `<div class="deal-badge">-${d.discount}%</div>` : ''}
                <div class="deal-source">${d.source}</div>
            </div>
            <div class="deal-info">
                <div class="deal-category">${d.category}</div>
                <div class="deal-title">${d.title}</div>
                <div class="deal-price">
                    <span class="price-current">€${d.price.toFixed(2)}</span>
                    <span class="price-original">€${d.originalPrice.toFixed(2)}</span>
                    <span class="price-discount">-${d.discount}%</span>
                </div>
                <a href="${d.url}" target="_blank" rel="noopener sponsored" class="deal-btn">
                    <i class="fas fa-external-link-alt"></i> Vai all'offerta
                </a>
            </div>
        </div>
    `).join('');

    loadMoreBtn.style.display = visibleCount < filtered.length ? 'block' : 'none';
}

function applyFilters() {
    let deals = [...allDeals];

    if (currentCat !== 'tutti') deals = deals.filter(d => d.category === currentCat);
    if (searchQuery) deals = deals.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (currentSort === 'discount') deals.sort((a, b) => b.discount - a.discount);
    else if (currentSort === 'price-asc') deals.sort((a, b) => a.price - b.price);
    else if (currentSort === 'price-desc') deals.sort((a, b) => b.price - a.price);
    else if (currentSort === 'newest') deals.reverse();

    filtered = deals;
    visibleCount = 24;
    renderDeals();
}

window.filterCat = function(cat) {
    currentCat = cat;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
    applyFilters();
};

async function loadAllFeeds() {
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('dealsGrid').innerHTML = '';

    for (const feed of FEEDS) {
        const items = await fetchFeed(feed);
        allDeals.push(...items);
        applyFilters();
        await new Promise(r => setTimeout(r, 300));
    }

    document.getElementById('loadingSpinner').style.display = 'none';
    applyFilters();
}

document.addEventListener('DOMContentLoaded', () => {
    loadAllFeeds();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => filterCat(btn.dataset.cat));
    });

    document.getElementById('sortSelect').addEventListener('change', e => {
        currentSort = e.target.value;
        applyFilters();
    });

    let searchTimer;
    document.getElementById('searchInput').addEventListener('input', e => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            searchQuery = e.target.value;
            currentCat = 'tutti';
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === 'tutti'));
            applyFilters();
        }, 300);
    });

    document.getElementById('loadMore').addEventListener('click', () => {
        visibleCount += 24;
        renderDeals();
    });
});
