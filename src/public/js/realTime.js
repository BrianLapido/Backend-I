const socket = io();
const buttons = document.querySelectorAll(".add-to-cart");
const productList = document.getElementById("product-list");
const form = document.getElementById("form-product");
/* let cartId = document.querySelector("cartId") */
//---------------------logica carrito------------------------//
/* async function cartExist() {
  if (cartId) return cartId;

  const res = await fetch("/api/carts", { 
    method: "POST",
    headers:{
      "Authorization" : `Bearer ${localStorage.getItem("token")}`
    },
    body:JSON.stringify({products: []})
   });

  if (!res.ok) {
    throw new Error("No se pudo crear el carrito");
  }

  const data = await res.json();

  cartId = data.cart._id;
  localStorage.setItem("cartId", cartId);

  console.log("🛒 Carrito creado:", cartId);
  return cartId
}
cartExist(); */



//-----------------------Escuchas-------------------------//

socket.on("realTimeProducts", (data) => {
  productList.innerHTML = "";

  data.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("col-md-4");

    div.innerHTML = `
      <div class="card h-100 shadow-sm" style="width: 16rem;">
        <img src="${p.thumbnail}" class="card-img-top" alt="${p.title}">
        <div class="card-body">
          <h5 class="card-title">${p.title}</h5>
          <p class="card-text">${p.description}</p>
          <p class="fw-bold text-success">$${p.price}</p>
          <a href="#" class="btn btn-primary w-100 add-to-cart" data-id="${p._id}">Agregar al Carrito</a>
        </div>
      </div>`;

    productList.appendChild(div);
  });
});


socket.on("productoEliminado", (product) => {
  const li = document.querySelector(`[data-id="${product.id}"]`);
  productList.textContent = `Se elimino producto : ${product.title}`;

  if (li) {
    li.remove();
  } else {
    console.error(`No se encontro el producto con id : ${product.id}`);
  }
});

socket.on("productoActualizado", (product) => {
  const li = document.querySelector(`[data-id="${product.id}"]`);

  if (li) {
    li.textContent = `Producto ${product.title} actualizado.`;
  } else {
    console.error(error, "Error al actualizar");
  }
});

//--------------------evento para el formulario---------------------//
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const price = parseFloat(document.getElementById("price").value);

  if (!title || isNaN(price)) {
    console.error("Algo salio mal");
    return;
  }

  try {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, price }),
    });

    if (!response.ok) {
      throw new Error("Error al agregar el producto.");
    }

    const data = await response.json();
    const product = data.product;

    await fetch(`/api/carts/products/${product._id}`, {
      method: "POST",
    });

    document.dispatchEvent(new CustomEvent("cart:changed"));

    
    Toastify({
      text: `Producto "${product.title}" agregado al carrito correctamente.`,
      duration: 3000,
      gravity: "top",
      position: "right",
      style: { background: "#28a745" },
    }).showToast();

    socket.emit("nuevoProducto", product);

    form.reset();
  } catch (error) {
    console.error(error);

    Toastify({
      text: "No pudo agregarse un nuevo producto",
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: { backgraund: "#df2929ff" },
    }).showToast();
  }
});

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".add-to-cart");
  if (!btn) return;

  e.preventDefault();
  
  const productId = btn.dataset.id;
     
  try {
    const response = await fetch(`/api/carts/products/${productId}`, {
      method: "POST"
    });

    if (!response.ok) {
      throw new Error("Error al agregar producto al carrito.");
    }

    await response.json();
    document.dispatchEvent(new CustomEvent("cart:changed"));

    Toastify({
      text: "Producto agregado al carrito 🛒",
      duration: 2500,
      gravity: "top",
      position: "right",
      style: { background: "#198754", color: "white" },
    }).showToast();

  } catch (error) {
    console.error(error);

    Toastify({
      text: "❌ Error al agregar producto",
      duration: 2500,
      gravity: "top",
      position: "right",
      style: { background: "#dc3545", color: "white" },
    }).showToast();
  }
});
