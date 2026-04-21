let cat = 'tutti';

function filter(el) {
  document.querySelectorAll('#nav a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
  cat = el.dataset.cat;
  render();
}

function render() {
  const q = (document.getElementById('q').value || '').toLowerCase();
  let items = CATALOG;
  if (cat !== 'tutti') items = items.filter(p => p.cat === cat);
  if (q) items = items.filter(p => p.title.toLowerCase().includes(q));

  document.getElementById('grid').innerHTML = items.map(p => {
    const disc = p.orig ? Math.round((1 - p.price / p.orig) * 100) : 0;
    return `<div class="card">
      <div class="card-img">
        ${disc > 0 ? `<span class="badge">-${disc}%</span>` : ''}
        <img src="${p.img}" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=300&fit=crop'">
      </div>
      <div class="card-body">
        <p class="card-title">${p.title}</p>
        <div class="prices">
          <span class="price">€${p.price.toFixed(2)}</span>
          ${p.orig ? `<span class="orig">€${p.orig.toFixed(2)}</span>` : ''}
        </div>
      </div>
      <a href="${p.url}" target="_blank" rel="sponsored nofollow" class="btn-buy"><i class="fab fa-amazon"></i> Vedi su Amazon</a>
    </div>`;
  }).join('') || '<p style="text-align:center;padding:40px;color:#aaa">Nessun prodotto trovato.</p>';
}

render();
