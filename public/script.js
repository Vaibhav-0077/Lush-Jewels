// ================= MOBILE MENU =================
document.getElementById('menu-btn').addEventListener('click', function () {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
  if (!menu.classList.contains('hidden')) {
    document.getElementById('mobile-search-input').focus();
  }
});

// ================= PRODUCT VIEW REDIRECT =================
// document.addEventListener('click', (e) => {
//   if (e.target.classList.contains('view-btn')) {
//     const card = e.target.closest('.product-card');
//     if (!card) return;

//     const img = card.querySelector('img').src;
//     const title = card.querySelector('h3').textContent;
//     const price = card.querySelector('p').textContent;
//     const description = card.querySelector('img').alt;

//     const productData = { img, title, price, description };
//     localStorage.setItem('selectedProduct', JSON.stringify(productData));

//     window.location.href = "product.html";
//   }
// });

// ========== GLOBAL CART ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartBtn = document.getElementById('cart-btn');
const mobileCartBtn = document.getElementById('mobile-cart-btn'); // ✅ fixed
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const mobileCartCount = document.getElementById('mobile-cart-count'); // ✅ update mobile badge too

function updateCartCount() {
  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  cartCount.textContent = totalQty;
  if (mobileCartCount) mobileCartCount.textContent = totalQty;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function renderCart() {
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
    // ✅ Support both `name` and `title`
    const title = item.name || item.title || "Unnamed Product";
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


window.removeFromCart = function(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
};

window.changeQty = function(index, delta) {
  cart[index].qty = (cart[index].qty || 1) + delta;
  if (cart[index].qty < 1) cart[index].qty = 1;
  saveCart();
  renderCart();
};

// ✅ Open sidebar cart (desktop + mobile)
cartBtn.addEventListener('click', () => {
  renderCart();
  cartModal.classList.remove('translate-x-full');
});

if (mobileCartBtn) {
  mobileCartBtn.addEventListener('click', () => {
    renderCart();
    cartModal.classList.remove('translate-x-full');
  });
}

// ✅ Close sidebar cart
closeCart.addEventListener('click', () => {
  cartModal.classList.add('translate-x-full');
});

// Close if clicking backdrop (optional)
document.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.classList.add('translate-x-full');
  }
});

updateCartCount();


window.changeQty = function(index, delta) {
  cart[index].qty = (cart[index].qty || 1) + delta;
  if (cart[index].qty < 1) cart[index].qty = 1;
  saveCart();
  renderCart();
};



// ================= SEARCH =================
function handleSearch(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const productCards = document.querySelectorAll('.product-card');

  function performSearch() {
    const query = input.value.trim().toLowerCase();
    let anyMatch = false;
    productCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('img').alt.toLowerCase();
      if (title.includes(query) || description.includes(query)) {
        card.style.display = '';
        anyMatch = true;
      } else {
        card.style.display = 'none';
      }
    });
    if (!anyMatch && query !== '') {
      showToast(`No products found for "${query}"`);
      productCards.forEach(card => card.style.display = '');
    }
  }

  btn.addEventListener('click', performSearch);
  input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') performSearch();
  });
}

// Apply search to header + mobile inputs
handleSearch('header-search-input', 'header-search-btn');
handleSearch('mobile-search-input', 'mobile-search-btn');



// ================= TOAST =================
// function showToast(message, type = "success") {
//   let toast = document.getElementById("toast");
//   if (!toast) {
//     toast = document.createElement("div");
//     toast.id = "toast";
//     document.body.appendChild(toast);
//   }

//   toast.textContent = message;
//   toast.className = `
//     fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
//     z-50 px-6 py-3 rounded-lg shadow-lg text-white text-lg
//     ${type === "error" ? "bg-red-600" : "bg-green-600"}
//   `;

//   setTimeout(() => toast.remove(), 2000);
// }


  // ✅ Global Toast Function (Red for error, Green for success)
  function showToast(message, type = "success") {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
      z-50 px-6 py-3 rounded-xl shadow-lg text-white text-lg ${
        type === "error" ? "bg-red-600" : "bg-green-600"
      }`;

    // Fade in
    requestAnimationFrame(() => {
      toast.classList.add("opacity-100");
    });

    // Fade out and remove
    setTimeout(() => {
      toast.classList.remove("opacity-100");
      setTimeout(() => toast.remove(), 300);
    }, 1800);
  }

  // ✅ Checkout Button Handler
  document.addEventListener("DOMContentLoaded", () => {
    const checkoutBtn = document.getElementById("checkout-btn");
    const cartModal = document.getElementById("cart-modal");

    if (!checkoutBtn) return;

    checkoutBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Check for cart existence
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        showToast("⚠ Your cart is empty!", "error");
        return;
      }

      // Check login status safely
      // const isLoggedIn = "<%= !!(session && session.user) %>";

      // if (isLoggedIn) {
      //   if (cartModal) cartModal.classList.add("translate-x-full");
      //   window.location.href = "/checkout";
      // } else {
      //   // ✅ Show red toast before redirect
      //   showToast("⚠ Please login to proceed to checkout.", "error");
      //   console.log("🟥 User not logged in – showing toast before redirect");
      //   setTimeout(() => {
      //     window.location.href = "/user/login?message=Please login to continue";
      //   }, 2000);
      // }
    });
  });

  // ===============================================================================================


// ================= PAGINATION =================
// const pages = Array.from(document.querySelectorAll('.page'));
// let currentPage = 1;
// const totalPages = pages.length;
// const prevBtn = document.getElementById('prev-btn');
// const nextBtn = document.getElementById('next-btn');
// const pageIndicator = document.getElementById('page-indicator');
// const paginationControls = prevBtn ? prevBtn.parentElement : null;

// function showPage(n) {
//   if (n < 1) n = 1;
//   if (n > totalPages) n = totalPages;
//   currentPage = n;

//   pages.forEach((p, i) => p.classList.toggle('hidden', i !== currentPage - 1));
//   if (pageIndicator) pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
//   if (prevBtn) prevBtn.disabled = currentPage === 1;
//   if (nextBtn) nextBtn.disabled = currentPage === totalPages;
// }
// if (prevBtn) prevBtn.addEventListener('click', () => showPage(currentPage - 1));
// if (nextBtn) nextBtn.addEventListener('click', () => showPage(currentPage + 1));
// showPage(1);

// ================= SEARCH =================
const searchResults = document.getElementById('search-results');
const searchContainer = document.getElementById('search-container');
const backBtn = document.getElementById('back-to-collection');

// Collect all products into an array (once)
const allProducts = Array.from(document.querySelectorAll('.product-card')).map(card => ({
  title: card.querySelector('h3')?.textContent || '',
  price: card.querySelector('p')?.textContent || '',
  img: card.querySelector('img')?.src || '',
  alt: card.querySelector('img')?.alt || ''
}));

function performSearch(queryRaw) {
  const query = (queryRaw || '').trim().toLowerCase();
  if (!query) return;

  let firstMatch = null;
  let found = false;

  document.querySelectorAll('.product-card').forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const alt = card.querySelector('img')?.alt.toLowerCase() || '';

    if (title.includes(query) || alt.includes(query)) {
      if (!firstMatch) firstMatch = card;
      found = true;
    }
  });

  if (!found) {
    showToast(`No products found for "${query}"`);
    return;
  }

  // ✅ Scroll to the first matched product
  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }



  // Hide all pages + pagination
  // pages.forEach(p => p.classList.add('hidden'));
  // if (paginationControls) paginationControls.classList.add('hidden');

  searchContainer.innerHTML = '';

  const results = allProducts.filter(p =>
    p.title.toLowerCase().includes(query) || p.alt.toLowerCase().includes(query)
  );

  if (results.length === 0) {
    searchContainer.innerHTML = `<p class="w-full text-center text-gray-600 py-6">
      No products found for "<strong>${query}</strong>"
    </p>`;
  } 

  searchResults.classList.remove('hidden');
  backBtn.classList.remove('hidden');
}

// Setup search inputs
function setupSearch(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input || !btn) return;

  btn.addEventListener('click', () => performSearch(input.value));
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') performSearch(input.value);
  });
}
setupSearch('header-search-input', 'header-search-btn');
setupSearch('mobile-search-input', 'mobile-search-btn');


backBtn.addEventListener('click', () => {
  searchResults.classList.add('hidden');
  searchContainer.innerHTML = '';

  document.querySelectorAll('.product-card').forEach(card => {
    card.style.display = '';
  });

  backBtn.classList.add('hidden');

  const productsSection = document.getElementById('products');
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth' });
  }
});









// // <!-- Cart Modal -->
// <div id="cart-modal" class="modal">
//   <div class="bg-white p-6 rounded-lg max-w-md w-full flex flex-col h-[80vh]">
//     <span id="close-cart" class="float-right text-2xl cursor-pointer">&times;</span>
//     <h2 class="text-2xl font-bold mb-4">Your Cart</h2>

//     {/* <!-- Scrollable items area --> */}
//     <div id="cart-items" class="flex-1 overflow-y-auto pr-2"></div>

//     {/* <!-- Fixed checkout button --> */}
//     <div class="mt-4">
//       <button class="bg-green-500 text-white px-4 py-2 rounded w-full">
//         Checkout
//       </button>
//     </div>
//   </div>
// </div>



// ================= CHECKOUT =================
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.getElementById('close-checkout');
const checkoutForm = document.getElementById('checkout-form');

  document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkout-btn");
  if (!checkoutBtn) return;

  checkoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast("⚠ Your cart is empty!", "error");
      return;
    }

    // ✅ Boolean instead of string
    const isLoggedIn = "<%= !!(session && session.user) %>";

    if (isLoggedIn) {
      cartModal.classList.add("translate-x-full");
      window.location.href = "/user/checkout";
    } else {
      // ✅ Show red toast clearly for 1.5s before redirect
      showToast("⚠ Please login to proceed to checkout.", "error");
      setTimeout(() => {
        window.location.href = "/user/login?message=Please login to continue";
      }, 1800); // wait for toast to fully show
    }
  });
});

// 🧩 Remove duplicate product cards by product name
document.addEventListener("DOMContentLoaded", () => {
  const seen = new Set();
  document.querySelectorAll(".product-card").forEach(card => {
    const name = card.querySelector("h3")?.textContent.trim().toLowerCase();
    if (seen.has(name)) {
      card.style.display = "none"; // hide duplicates
    } else {
      seen.add(name);
    }
  });
});

// =======================================================================================================


if (closeCheckout) {
  closeCheckout.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
  });
}

if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !address || !phone) {
      showToast("⚠ Please fill all fields", "error");
      return;
    }

    const newOrder = {
      name, address, phone,
      payment: "Cash on Delivery",
      items: cart,
      date: new Date().toLocaleString()
    };

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    showToast(`✅ Thank you ${name}! Your order has been placed.`);
    cart = [];
    saveCart();
    renderCart();
    checkoutModal.style.display = 'none';
  });
}



// ==================================================================================================================
// ==================================================================================================================

// Redirect user to product page by name only
// document.querySelectorAll(".view-btn").forEach((btn) => {
//   btn.addEventListener("click", () => {
//     const card = btn.closest(".product-card");
//     const name = card.querySelector("h3").textContent.trim();
//     const price = card.querySelector("p").textContent.trim();
//     const img = card.querySelector("img").getAttribute("src");

//     // Redirect to product page
//     const query = new URLSearchParams({ name, price, img }).toString();
//     window.location.href = `/product?${query}`;
//   });
// });



// ✅ Redirect user to product page by MongoDB ID
// document.querySelectorAll(".view-btn").forEach((btn) => {
//   btn.addEventListener("click", () => {
//     const card = btn.closest(".product-card");
//     const id = card.getAttribute("data-id"); // <-- get product id
//     if (!id) return alert("Product ID missing!");

//     // Redirect to backend route that uses product ID
//     window.location.href = `/product/${id}`;
//   });
// });

document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product-card");
      const id = card.getAttribute("data-id");
      if (id) {
        window.location.href = `/product/${id}`;
      } else {
        alert("❌ Product ID not found!");
      }
    });
  });


// ==================================================================================================================

// 🧩 Prevent duplicate products across all sections
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".product-card");
  const seen = new Set();

  cards.forEach(card => {
    const id = card.getAttribute("data-id");
    if (id) {
      if (seen.has(id)) {
        card.remove(); // remove duplicates
      } else {
        seen.add(id);
      }
    }
  });
});

