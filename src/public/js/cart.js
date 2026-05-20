const cartButton = document.getElementById("cart-button");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartClose = document.getElementById("cart-close");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartClear = document.getElementById("cart-clear");

function getAuthEnabled() {
  return cartButton?.dataset.auth === "true";
}

function openCart() {
  if (!getAuthEnabled()) {
    window.location.href = "/";
    return;
  }

  cartPanel.classList.add("is-open");
  cartOverlay.classList.add("is-open");
  cartPanel.setAttribute("aria-hidden", "false");
  loadCart();
}

function closeCart() {
  cartPanel.classList.remove("is-open");
  cartOverlay.classList.remove("is-open");
  cartPanel.setAttribute("aria-hidden", "true");
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function getProduct(item) {
  return item.product || {};
}

function getProductId(item) {
  const product = getProduct(item);
  return product._id || product;
}

function calculateCart(cart) {
  const products = cart?.products || [];
  return products.reduce(
    (totals, item) => {
      const product = getProduct(item);
      const quantity = Number(item.quantity || 0);
      totals.count += quantity;
      totals.total += Number(product.price || 0) * quantity;
      return totals;
    },
    {count: 0, total: 0}
  );
}

function setCartSummary(cart) {
  const totals = calculateCart(cart);
  cartCount.textContent = totals.count;
  cartTotal.textContent = formatMoney(totals.total);
  cartClear.disabled = totals.count === 0;
}

function renderCart(cart) {
  const products = cart?.products || [];
  setCartSummary(cart);

  if (products.length === 0) {
    cartItems.innerHTML = `<p class="cart-empty">Tu carrito esta vacio.</p>`;
    return;
  }

  cartItems.innerHTML = products.map((item) => {
    const product = getProduct(item);
    const productId = getProductId(item);
    const title = product.title || "Producto";
    const image = product.thumbnail || "";
    const price = formatMoney(product.price);

    return `
      <article class="cart-item" data-product-id="${productId}">
        <img class="cart-item-image" src="${image}" alt="${title}">
        <div>
          <h3 class="cart-item-title">${title}</h3>
          <p class="cart-item-price">${price}</p>
          <div class="cart-item-controls">
            <input class="cart-quantity-input" type="number" min="1" value="${item.quantity}" aria-label="Cantidad de ${title}">
            <button class="cart-action-button cart-update" type="button">Actualizar</button>
            <button class="cart-action-button cart-danger-button cart-remove" type="button">Eliminar</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

async function requestCart(url, options = {}) {
  const response = await fetch(url, {
    headers: {"Content-Type": "application/json", ...(options.headers || {})},
    ...options
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "No se pudo actualizar el carrito");
  }

  return response.json();
}

async function loadCart() {
  cartItems.innerHTML = `<p class="cart-empty">Cargando carrito...</p>`;

  try {
    const data = await requestCart("/api/carts/current");
    renderCart(data.cart);
  } catch (error) {
    cartItems.innerHTML = `<p class="cart-error">${error.message}</p>`;
  }
}

async function updateProduct(productId, quantity) {
  const data = await requestCart(`/api/carts/products/${productId}`, {
    method: "PUT",
    body: JSON.stringify({quantity})
  });
  renderCart(data.cart);
}

async function removeProduct(productId) {
  const data = await requestCart(`/api/carts/products/${productId}`, {
    method: "DELETE"
  });
  renderCart(data.cart);
}

async function clearCart() {
  const data = await requestCart("/api/carts/products", {
    method: "DELETE"
  });
  renderCart(data.cart);
}

cartButton?.addEventListener("click", openCart);
cartClose?.addEventListener("click", closeCart);
cartOverlay?.addEventListener("click", closeCart);

cartItems?.addEventListener("click", async (event) => {
  const item = event.target.closest(".cart-item");
  if (!item) return;

  const productId = item.dataset.productId;

  try {
    if (event.target.classList.contains("cart-update")) {
      const quantity = item.querySelector(".cart-quantity-input").value;
      await updateProduct(productId, quantity);
    }

    if (event.target.classList.contains("cart-remove")) {
      await removeProduct(productId);
    }
  } catch (error) {
    cartItems.insertAdjacentHTML("afterbegin", `<p class="cart-error">${error.message}</p>`);
  }
});

cartClear?.addEventListener("click", async () => {
  try {
    await clearCart();
  } catch (error) {
    cartItems.insertAdjacentHTML("afterbegin", `<p class="cart-error">${error.message}</p>`);
  }
});

document.addEventListener("cart:changed", () => {
  if (cartPanel?.classList.contains("is-open")) {
    loadCart();
    return;
  }

  if (getAuthEnabled()) {
    requestCart("/api/carts/current")
      .then((data) => setCartSummary(data.cart))
      .catch(() => {});
  }
});

if (getAuthEnabled()) {
  requestCart("/api/carts/current")
    .then((data) => setCartSummary(data.cart))
    .catch(() => {});
}
