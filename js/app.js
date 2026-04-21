const TAG = 'prezzotop08-21';
const STORE_KEY = 'dropshop_products_v1';

function getProducts() {
  // Unisce prodotti manuali (localStorage) con il catalogo automatico
  const manual = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
  const manualAsins = new Set(manual.map(p => p.asin));
  const catalog = (typeof CATALOG !== 'undefined' ? CATALOG : []).filter(p => !manualAsins.has(p.asin));
  return [...manual, ...catalog];
}

function saveManual(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }
function getManual() { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }

let currentCat = 'tutti';

function filterCat(cat) {
  currentCat = cat;
  document.querySelectorAll('.header-nav a').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.header-nav a').forEach(a => {
    if (a.dataset.cat === cat) a.classList.add('active');
  });
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const empty = document.getElementById('emptyMsg');
  if (!grid) return;

  const query = (document.getElementById('searchInput')?.value || '').toLowerCase();
  let products = getProducts();
  if (currentCat !== 'tutti') products = products.filter(p => p.cat === currentCat);
  if (query) products = products.filter(p => p.title.toLowerCase().includes(query));

  if (!products.length) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  grid.innerHTML = products.map(p => {
    const discount = p.origPrice && p.price ? Math.round((1 - p.price / p.origPrice) * 100) : 0;
    return `
    <div class="product-card">
      <div class="card-img">
        ${discount > 0 ? `<span class="badge">-${discount}%</span>` : ''}
        <img src="${p.img || ''}" alt="${p.title}"
          onerror="this.src='https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop'">
      </div>
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-prices">
          <span class="price-current">€${Number(p.price).toFixed(2)}</span>
          ${p.origPrice ? `<span class="price-original">€${Number(p.origPrice).toFixed(2)}</span>` : ''}
        </div>
        <div class="card-footer">
          <a href="${p.url}" target="_blank" rel="nofollow sponsored" class="btn-amazon">
            <i class="fab fa-amazon"></i> Vedi su Amazon
          </a>
        </div>
      </div>
    </div>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  // attiva "Tutti" di default
  const tuttiLink = document.querySelector('.header-nav a[data-cat="tutti"]');
  if (tuttiLink) tuttiLink.classList.add('active');
  renderProducts();
});
