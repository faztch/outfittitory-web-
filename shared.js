// =============================================
// OUTFITITORY - Shared Cart & Utilities
// =============================================

// CART FUNCTIONS
function getCart() {
  return JSON.parse(localStorage.getItem('outfititory_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('outfititory_cart', JSON.stringify(cart));
  updateAllCartCounts();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    cart.push({ ...product, quantity: product.quantity || 1 });
  }
  saveCart(cart);
  showCartToast(product.name);
}

function updateCartItem(id, change) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function updateAllCartCounts() {
  document.querySelectorAll('.cart-count').forEach(el => {
    const count = getCartCount();
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
  renderCartDrawer();
}

// TOAST NOTIFICATION
function showCartToast(name) {
  const existing = document.getElementById('cart-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'cart-toast';
  toast.innerHTML = `<span>✓</span> <em>${name}</em> added to cart`;
  toast.style.cssText = `
    position:fixed; bottom:30px; left:50%; transform:translateX(-50%) translateY(20px);
    background:#1a1a1a; color:#fff; padding:14px 24px; border-radius:50px;
    font-size:14px; font-family:'Cormorant Garamond',serif; letter-spacing:0.5px;
    border:1px solid rgba(180,150,90,0.4); z-index:9999;
    opacity:0; transition:all 0.4s ease; white-space:nowrap;
    box-shadow:0 8px 30px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// CART DRAWER RENDER
function renderCartDrawer() {
  const body = document.getElementById('cart-drawer-body');
  const footer = document.getElementById('cart-drawer-footer');
  if (!body) return;
  const cart = getCart();

  if (cart.length === 0) {
    body.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#999;">
        <div style="font-size:48px;margin-bottom:16px;">🛒</div>
        <p style="font-family:'Cormorant Garamond',serif;font-size:18px;">Your cart is empty</p>
        <a href="plp.html" onclick="closeCartDrawer()" style="display:inline-block;margin-top:20px;color:#b8965a;font-size:13px;text-decoration:underline;letter-spacing:1px;">SHOP NOW</a>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

  body.innerHTML = cart.map(item => `
    <div class="drawer-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}">
      <div class="drawer-item-info">
        <div class="drawer-item-name">${item.name}</div>
        <div class="drawer-item-price">Rs ${(item.price * item.quantity).toLocaleString()}</div>
        <div class="drawer-qty">
          <button onclick="updateCartItem('${item.id}',-1);renderCartDrawer()">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateCartItem('${item.id}',1);renderCartDrawer()">+</button>
          <span class="drawer-remove" onclick="removeFromCart('${item.id}');renderCartDrawer()">Remove</span>
        </div>
      </div>
    </div>
  `).join('');

  const total = getCartTotal();
  document.getElementById('drawer-total').textContent = `Rs ${total.toLocaleString()}`;
}

// CART DRAWER OPEN/CLOSE
function openCartDrawer() {
  renderCartDrawer();
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  updateAllCartCounts();

  // Mobile nav toggle
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }

  // Cart overlay click
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.addEventListener('click', closeCartDrawer);
});
