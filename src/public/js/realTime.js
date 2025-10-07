
const socket = io();

const productList = document.getElementById("product-list");
const form = document.getElementById("form-product");


//-----------------------Escuchas-------------------------//

socket.on("realTimeProducts", data=>{
    productList.innerHTML = "";
    data.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.title} - $${p.price}`
        li.dataset.id = p.id;
        productList.appendChild(li);
    });
})
    socket.on("nuevoProducto", product=>{
        const li = document.createElement("li");
        li.textContent = `${product.title} - $${product.price}`;
        li.dataset.id = product.id;
        productList.appendChild(li);
        productList.textContent= `Se ha añadido un nuevo producto ${product.title}`
    })

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
    })

    //--------------------evento para el formulario---------------------//
form.addEventListener("submit", e=>{
    e.preventDefault();
    const title = document.getElementById("title").value
    const price = parseFloat(document.getElementById("price").value);
    socket.emit("nuevoProducto", {title, price});
    form.reset();
})