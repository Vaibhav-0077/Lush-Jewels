// ====================================================
// 🛍️ Global Cart Script (Shared by Home, Product, Checkout)
// ====================================================

// ✅ Initialize cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 🔹 Helper DOM elements
const cartBtn = document.getElementById('cart-btn');
const mobileCartBtn = document.getElementById('mobile-cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const mobileCartCount = document.getElementById('mobile-cart-count');

// ====================================================
// ✅ HELPER FUNCTION (Fixes “undefined” product name)
// ====================================================

function getItemTitle(item) {
  // Returns whichever field exists: name OR title
  return item.name || item.title || "Unnamed Product";
}

// ====================================================
// 🧮 Utility Functions
// ====================================================

function updateCartCount() {
  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  if (cartCount) cartCount.textContent = totalQty;
  if (mobileCartCount) mobileCartCount.textContent = totalQty;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function changeQty(index, delta) {
  cart[index].qty = (cart[index].qty || 1) + delta;
  if (cart[index].qty < 1) cart[index].qty = 1;
  saveCart();
  renderCart();
}

// ====================================================
// 🛒 Render Cart Sidebar
// ====================================================

function renderCart() {
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <p class="text-gray-600 text-center py-6">Your cart is empty.</p>
    `;
    document.getElementById('cart-total').textContent = "₹0.00";
    updateCartCount();
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = cart.map((item, index) => {
    const title = getItemTitle(item);
    const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    const qty = item.qty || 1;
    const itemTotal = priceNum * qty;
    total += itemTotal;

    return `
      <div class="flex items-center justify-between border rounded-lg p-3 bg-gray-50">
        <img src="${item.img}" class="w-14 h-14 object-cover rounded">
        <div class="flex-1 ml-3">
          <p class="font-semibold text-sm leading-tight">${title}</p>
          <p class="text-gray-500 text-xs mb-1">₹${priceNum.toFixed(2)} each</p>

          <div class="flex items-center gap-2">
            <button onclick="changeQty(${index}, -1)"
              class="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-200">−</button>
            <span class="min-w-[1.5rem] text-center">${qty}</span>
            <button onclick="changeQty(${index}, 1)"
              class="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-200">+</button>
          </div>
        </div>

        <div class="flex flex-col items-end">
          <p class="text-sm font-semibold">₹${itemTotal.toFixed(2)}</p>
          <button onclick="removeFromCart(${index})"
            class="text-red-500 hover:text-red-700 text-xs mt-1">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('cart-total').textContent = "₹" + total.toFixed(2);
  updateCartCount();
}

// ====================================================
// 🧾 Checkout Rendering
// ====================================================

function renderCheckout() {
  const checkoutContainer = document.getElementById('checkout-container');
  const totalAmount = document.getElementById('total-amount');
  if (!checkoutContainer) return;

  checkoutContainer.innerHTML = '';
  let subtotal = 0;

  // ✅ Detect if single-product checkout (via query params)
  const urlParams = new URLSearchParams(window.location.search);
  const isSingle = urlParams.get('single') === 'true';
  let products = [];

  if (isSingle) {
    const name = urlParams.get('name');
    const price = urlParams.get('price');
    const img = urlParams.get('img');
    const qty = parseInt(urlParams.get('qty')) || 1;

    if (name && price && img) {
      products.push({ name, price, img, qty });
    }
  } else {
    // ✅ Normal checkout — load all items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    products = cart;
  }

  if (products.length === 0) {
    checkoutContainer.innerHTML = `
      <p class="text-center text-gray-500 py-8">Your cart is empty 🛍️</p>
    `;
    if (totalAmount) totalAmount.textContent = "₹0.00";
    return;
  }

  // ✅ Render all products
  products.forEach(item => {
    const title = item.title || item.name || "Unknown Product";
    const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    const qty = item.qty || 1;
    const lineTotal = priceNum * qty;
    subtotal += lineTotal;

    checkoutContainer.innerHTML += `
      <div class="flex items-center justify-between border rounded p-2 bg-gray-50">
        <img src="${item.img}" class="w-14 h-14 object-cover rounded">
        <div class="flex-1 ml-3">
          <p class="text-sm font-medium">${title}</p>
          <p class="text-xs text-gray-500">Qty: ${qty}</p>
        </div>
        <p class="text-sm font-semibold">₹${lineTotal.toFixed(2)}</p>
      </div>
    `;
  });

  // ✅ Update totals
  if (totalAmount) totalAmount.textContent = "₹" + subtotal.toFixed(2);
}




function getItemTitle(item) {
  // Prefer 'title', but fall back to 'name'
  return item.title || item.name || "Unnamed Product";
}


// ====================================================
// 🎨 Sidebar Toggle Logic
// ====================================================

if (cartBtn) {
  cartBtn.addEventListener('click', () => {
    renderCart();
    if (cartModal) cartModal.classList.remove('translate-x-full');
  });
}

if (mobileCartBtn) {
  mobileCartBtn.addEventListener('click', () => {
    renderCart();
    if (cartModal) cartModal.classList.remove('translate-x-full');
  });
}

if (closeCart) {
  closeCart.addEventListener('click', () => {
    cartModal.classList.add('translate-x-full');
  });
}

document.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.classList.add('translate-x-full');
  }
});





// ====================================================
// 🚀 Initialize Cart Data on Load
// ====================================================

updateCartCount();
renderCheckout(); // ✅ auto-load if on checkout page

