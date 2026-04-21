const TAG = 'prezzotop08-21';
const STORE_KEY = 'dropshop_products_v1';

function getProducts() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch { return []; }
}
function saveProducts(arr) {
  localStorage.setItem(STORE_KEY, JSON.stringify(arr));
}

let currentCat = 'tutti';

function filterCat(cat) {
  currentCat = cat;
  document.querySelectorAll('.header-nav a').forEach(a => a.classList.remove('active'));
  const links = document.querySelectorAll('.header-nav a');
  links.forEach(a => { if (a.textContent.toLowerCase().includes(cat === 'tutti' ? 'tutti' : cat)) a.classList.add('active'); });
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
        <img src="${p.img || 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop'}" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop'">
      </div>
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-prices">
          <span class="price-current">€${p.price.toFixed(2)}</span>
          ${p.origPrice ? `<span class="price-original">€${p.origPrice.toFixed(2)}</span>` : ''}
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
  if (document.getElementById('productsGrid')) renderProducts();
});
