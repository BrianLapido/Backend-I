const mongoCartManager= require("../../dao/mongoCartsManager.js")

const socket = io();
//const buttons = document.querySelectorAll(".add-to-cart")
const productList = document.getElementById("product-list");
const form = document.getElementById("form-product");
let cartId= localStorage.getItem("cartId");

//---------------------logica carrito------------------------//
async function cartExist() {
    if(!cartId){
       try {
         const res = await fetch("/api/carts", {method: "POST"})
         const data = await res.json();
         cartId = data.cart._id;
         localStorage.setItem("cartId", cartId);
         console.log("carrito creado", cartId)
       } catch (error) {
        console.error("Error al crear carrito:", error)
       }
    }
}

await cartExist(); 

//-----------------------Escuchas-------------------------//

socket.on("realTimeProducts", data=>{
    productList.innerHTML="";
    data.forEach(p => {
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


/* socket.on("realTimeProducts", data=>{
    productList.innerHTML = "";
    data.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.title} - $${p.price}`
        li.dataset.id = p.id;
        productList.appendChild(li);
    });
})

socket.on("nuevoProducto", (product)=>{
    const list = document.getElementById("product-list");
    if(!list)return;

    const div = document.createElement("div");
    div.classList.add("col-md-4");
    div.innerHTML= `
        <div class="card h-100 shadow-sm" style="width: 16rem;">
        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
        <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <p class="fw-bold text-success">$${product.price}</p>
            <a href="#" class="btn btn-primary w-100 add-to-cart" data-id="${product.id}">
            Agregar al Carrito
            </a>
        </div>
        </div>`;
    list.appendChild(div);
}) */


socket.on("productoEliminado", (product)=>{

    const li = document.querySelector(`[data-id="${product.id}"]`)
    productList.textContent = `Se elimino producto : ${product.title}`

    if(li){
        li.remove();
    }else{
        console.error(`No se encontro el producto con id : ${product.id}`);
    }
})

socket.on("productoActualizado", product =>{
    const li = document.querySelector(`[data-id="${product.id}"]`);

    if(li){
    li.textContent = `Producto ${product.title} actualizado.`
    }else{
    console.error(error, "Error al actualizar");
    }
});

    //--------------------evento para el formulario---------------------//
form.addEventListener("submit", async (e) =>{
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const price = parseFloat(document.getElementById("price").value);

    if(!title || isNaN(price)){
        console.error("Algo salio mal");
        return;
    }

    try {
        const response = await fetch("/api/realTimeProducts",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title, price}),
        });

        if(!response.ok){throw new Error("Error al agregar el producto.")};
            
        const data = await response.json();
        const product = data.newProduct;

        await fetch(`/api/carts/${cartId}/product/${product._id}`, {method: "POST"});

            
        Toastify({
            text: `Producto "${data.title}" agregado al carrito correctamente.`,
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {background: "#28a745"},
        }).showToast();
            
        socket.emit("nuevoProducto", data);

        form.reset();

    }catch (error) {
        console.error(error);

        Toastify({
            text:"No pudo agregarse un nuevo producto",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {backgraund: "#df2929ff"}
        }).showToast();
    };
});

document.addEventListener("click", async (e)=>{
    if(e.target.classList.contains("add-to-cart")){
        e.preventDefault();

        const productId = e.target.dataset.id

    try {

        if(!cartExist){
            throw new Error("El carrito no existe")
            };

        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {method: "POST"});

        if(!response){throw new Error("Error al agregar producto al carrito.")}
        const result= await response.json();

        Toastify({
            text: "Producto agregado al carrito 🛒",
            duration: 2500,
            gravity: "top",
            position: "right",
            style: { background: "#198754", color: "white" },
        }).showToast();

        console.log(result);

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
    }
});
