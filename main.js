/* ============================================
   NÓRD E-COMMERCE — main.js
   Orquestador central
   ============================================ */

/* ─── 00. Navbar Loader ─── */
function getNavbarPath() {
  const isInPages = window.location.pathname.includes('/pages/');
  return isInPages ? '../components/navbar.html' : 'components/navbar.html';
}

async function loadNavbar() {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  try {
    const res  = await fetch(getNavbarPath());
    const html = await res.text();
    container.innerHTML = html;

    const page = document.body.dataset.page;
    if (page) {
      const activeLink = container.querySelector(`[data-navlink="${page}"]`);
      if (activeLink) {
        activeLink.style.color = 'var(--accent)';
        activeLink.style.borderBottom = '1px solid var(--accent)';
        activeLink.style.paddingBottom = '3px';
      }
    }

    attachCursorExpand();
    initNavbarScroll();
  } catch (e) {
    console.warn('Error cargando navbar:', e);
  }
}

function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ─── 01. Custom Cursor ─── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  if (cursor) {
    cursor.style.left = mx - 5 + 'px';
    cursor.style.top  = my - 5 + 'px';
  }
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  if (ring) {
    ring.style.left = rx - 18 + 'px';
    ring.style.top  = ry - 18 + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

function attachCursorExpand() {
  const selector = 'button, a, .product-card, .filter-btn';
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mouseenter', () => ring?.classList.add('expand'));
    el.addEventListener('mouseleave', () => ring?.classList.remove('expand'));
  });
}

/* ─── 02. Marquee ─── */
const marqueeItems = ['Nueva colección', 'Envío gratis +$150', 'Materiales premium', 'Calidad garantizada', 'Diseño atemporal', '30 días de devolución'];

function buildMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  const repeated = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];
  track.innerHTML = repeated.map(t => `<span class="marquee-item">${t}<span>✦</span></span>`).join('') + repeated.map(t => `<span class="marquee-item">${t}<span>✦</span></span>`).join('');
}

/* ─── 03. Products Data ─── */
const products = [
  { id: 1, name: 'Blazer Structured', cat: 'ropa', price: 189, old: 249, badge: 'Nuevo', stars: 5, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4e74?w=500&q=80' },
  { id: 2, name: 'Bolso Tote Cuero', cat: 'accesorios', price: 229, old: null, badge: null, stars: 5, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80' },
  { id: 3, name: 'Derby Classic', cat: 'calzado', price: 159, old: 210, badge: 'Sale', stars: 4, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { id: 4, name: 'Jarrón Cerámica', cat: 'hogar', price: 89, old: null, badge: null, stars: 5, img: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&q=80' },
  { id: 5, name: 'Trench Coat Beige', cat: 'ropa', price: 299, old: 380, badge: 'Destacado', stars: 5, img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&q=80' },
  { id: 6, name: 'Mochila Minimalista', cat: 'accesorios', price: 145, old: null, badge: null, stars: 4, img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
  { id: 7, name: 'Chelsea Boots', cat: 'calzado', price: 195, old: 240, badge: 'Sale', stars: 4, img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&q=80' },
  { id: 8, name: 'Lámpara Arco', cat: 'hogar', price: 320, old: null, badge: 'Nuevo', stars: 5, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
];

/* ─── 04. Render Products ─── */
function renderStars(count) {
  return '<span class="star">★</span>'.repeat(count) + '<span class="star" style="opacity:0.25">★</span>'.repeat(5 - count);
}

function renderProductCard(p, i) {
  return `
    <div class="product-card" style="animation-delay:${i * 0.07}s">
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" class="product-img" loading="lazy">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <div class="product-actions">
          <button class="add-cart-btn" onclick="addToCart(${p.id})">+ Añadir</button>
          <button class="wish-btn">♡</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-footer">
          <div>
            <span class="product-price">$${p.price}</span>
            ${p.old ? `<span class="product-old-price">$${p.old}</span>` : ''}
          </div>
          <div class="product-rating">${renderStars(p.stars)}</div>
        </div>
      </div>
    </div>`;
}

function renderProducts(filter) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  const filtered = filter === 'all' ? products : products.filter(p => p.cat === filter);
  grid.innerHTML = filtered.map(renderProductCard).join('');
  
  attachCursorExpand();
}

function renderProductsFromList(list, gridId = 'productsGrid') {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = list.map(renderProductCard).join('');
  attachCursorExpand();
}

/* ─── 05. Cart ─── */
let cart = [];

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`${product.name} añadido`);
}

function changeQty(id, delta) {
  const index = cart.findIndex(item => item.id === id);
  if (index === -1) return;

  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);

  updateCartUI();
}

function openCart() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
}

function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const badge = document.getElementById('cartBadge');
  const totalEl = document.getElementById('cartTotal');
  if (badge) badge.textContent = totalCount;
  if (totalEl) totalEl.textContent = `$${totalPrice.toFixed(2)}`;

  const body = document.getElementById('cartBody');
  const emptyCart = document.getElementById('emptyCart');
  if (!body || !emptyCart) return;

  if (cart.length === 0) {
    body.innerHTML = '';
    emptyCart.style.display = 'block';
    body.appendChild(emptyCart);
    return;
  }

  emptyCart.style.display = 'none';
  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" class="cart-item-img" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ─── 06. Toast ─── */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ─── 07. Countdown ─── */
function tickCountdown() {
  if (!document.getElementById('c-h')) return;
  const now = new Date();
  const h = 8 - (now.getHours() % 9);
  const m = 59 - (now.getMinutes() % 60);
  const s = 59 - now.getSeconds();
  document.getElementById('c-h').textContent = String(h).padStart(2, '0');
  document.getElementById('c-m').textContent = String(m).padStart(2, '0');
  document.getElementById('c-s').textContent = String(s).padStart(2, '0');
}

/* ─── 08. Inicialización ─── */
document.addEventListener('DOMContentLoaded', () => {
  /* Marquee */
  buildMarquee();

  /* Countdown */
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* Cursor expand re-attach */
  attachCursorExpand();

  /* Navbar scroll (para index con navbar inline) */
  const nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* Cargar navbar dinámico para páginas internas */
  if (document.getElementById('navbar-container')) {
    loadNavbar();
  }

  /* Filter bar */
  const filterBar = document.getElementById('filterBar');
  if (filterBar) {
    filterBar.addEventListener('click', e => {
      if (!e.target.matches('.filter-btn')) return;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderProducts(e.target.dataset.cat);
    });
  }

  /* Render productos */
  if (document.getElementById('productsGrid')) {
    renderProducts('all');
  }
});