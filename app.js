// Navigation Toggle
const toggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
if (toggle && navList) {
  toggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Scroll Animation
const animated = [...document.querySelectorAll('[data-animate]')];
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
animated.forEach(el => io.observe(el));

// Data Fetching & Rendering
function initApp() {
  try {
    // Gunakan global variable dari products.js agar aman dari CORS (file://)
    const products = window.PRODUCT_DATA || [];
    
    if (!products.length) {
      console.warn('Data produk tidak ditemukan atau kosong.');
    }

    const gridProduk = document.getElementById('grid-produk');
    const detailContainer = document.querySelector('.product-detail .container');
    const featuredContainer = document.querySelector('.featured .grid');

    if (gridProduk) {
      renderCatalog(products, gridProduk);
      setupFilters(products, gridProduk);
    }

    if (detailContainer) {
      renderDetail(products, detailContainer);
    }

    if (featuredContainer) {
      renderFeatured(products, featuredContainer);
    }

  } catch (err) {
    console.error(err);
  }
}

function renderCatalog(products, container) {
  if (products.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--muted);">Tidak ada data produk.</div>';
    return;
  }
  
  container.innerHTML = products.map(p => `
    <div class="product" data-cat="${p.categoryId}" data-animate>
      <div class="product-media ${p.imageClass}"></div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-meta">${p.category}</div>
        <div class="product-actions">
          <a href="detail-produk.html?id=${p.id}" class="btn btn-light">Detail</a>
          <a href="index.html#kontak" class="btn btn-primary">Pesan</a>
        </div>
      </div>
    </div>
  `).join('');
  
  const newAnimated = [...container.querySelectorAll('[data-animate]')];
  newAnimated.forEach(el => io.observe(el));
}

function setupFilters(products, container) {
  const chips = [...document.querySelectorAll('.chip')];
  const items = [...container.children];

  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    
    const cat = c.dataset.cat;
    items.forEach(item => {
      const itemCat = item.dataset.cat;
      if (cat === 'all' || itemCat === cat) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }));
}

function renderDetail(products, container) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = products.find(p => p.id === id);

  if (!product) {
    container.innerHTML = '<p>Produk tidak ditemukan.</p>';
    return;
  }

  // Render Main Detail
  container.innerHTML = `
    <div class="detail-media" style="background:#eaf6f6; border-radius:24px; aspect-ratio:1/1;"></div>
    <div class="detail-info">
        <div class="chip" style="display:inline-block; width:auto; margin-bottom:16px;">${product.category}</div>
        <h2 style="font-size:32px; margin:0 0 16px;">${product.name}</h2>
        <p style="font-size:18px; color:var(--muted); line-height:1.6; margin-bottom:24px;">
           ${product.description}
        </p>
        
        <div style="margin-bottom:32px;">
          <h3 style="font-size:18px; margin-bottom:12px;">Spesifikasi</h3>
          <ul style="list-style:none; padding:0; display:grid; gap:8px; color:var(--muted);">
             ${product.specs.map(s => `<li style="display:flex; gap:12px;"><span style="color:var(--primary); font-weight:bold;"></span> ${s}</li>`).join('')}
          </ul>
        </div>

        <div class="detail-actions" style="display:flex; gap:16px;">
          <a href="index.html#kontak" class="btn btn-primary btn-lg">Minta Penawaran</a>
          <a href="#" class="btn btn-outline btn-lg">Download Datasheet</a>
        </div>
    </div>
  `;

  // Render Related Products (Random 3 for now, excluding current)
  const relatedContainer = document.querySelector('.related .grid');
  if (relatedContainer) {
    const related = products.filter(p => p.id !== id).sort(() => 0.5 - Math.random()).slice(0, 3);
    relatedContainer.innerHTML = related.map(p => `
      <div class="product" data-animate>
        <div class="product-media ${p.imageClass}"></div>
        <div class="product-body">
          <div class="product-name">${p.name}</div>
          <div class="product-meta">${p.category}</div>
          <div class="product-actions">
            <a href="detail-produk.html?id=${p.id}" class="btn btn-light">Detail</a>
          </div>
        </div>
      </div>
    `).join('');
    const newAnimated = [...relatedContainer.querySelectorAll('[data-animate]')];
    newAnimated.forEach(el => io.observe(el));
  }
}

function renderFeatured(products, container) {
  if (!products || products.length === 0) {
    return;
  }
  const featured = products.slice(0, 3);
  container.innerHTML = featured.map(p => `
    <div class="product" data-animate>
      <div class="product-media ${p.imageClass}"></div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <div class="product-meta">${p.category}</div>
        <div class="product-actions">
          <a href="detail-produk.html?id=${p.id}" class="btn btn-light">Detail</a>
          <a href="index.html#kontak" class="btn btn-primary">Pesan</a>
        </div>
      </div>
    </div>
  `).join('');
  const newAnimated = [...container.querySelectorAll('[data-animate]')];
  newAnimated.forEach(el => io.observe(el));
}

// Initialize
document.addEventListener('DOMContentLoaded', initApp);
