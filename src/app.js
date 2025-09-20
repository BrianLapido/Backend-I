const express = require("express");
const ProductManager = require("./productsManager.js");

const PORT = 8080;
const app = express();


//middleware
app.use(express.json());

const manager = new ProductManager("./products.json");

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost: ${PORT}`);
});

//obtener datos
app.get("/products", async (req, res) => {
    try{
        const product = req.params.product;
        const products = await manager.getProducts();
        res.send(products);
    }catch(err){
        res.json({error : err.message})
    }
});


//obtener producto por id

app.get("/products/:pid", async (req, res) => {
    try{
        const pid = req.params.id;
        const product = await manager.getProductsById(pid)

        if(!product){
            return res.status(404).json({error: "Producto no encontrado"});
        }
        res.send(product); 

    }catch(err){
        res.status(500).json({error: err.message})
    }
});

//agregar producto

app.post("/products", async (req, res) => {
    try{ 
        const newProduct = await manager.addProduct(req.body);
        res.status(201).json({message: "producto agregado", product: newProduct});
    }catch(err){
        res.status(400).json({"error:": err.message})
    }
})

//actualizar producto
app.put("/products", async (req, res) => {
    try {
        const pid = req.params.pid;
        const products = await manager.getProducts();

        //buscar p por id
        const product = product.find(p => String(p.id) === String(pid));

        if(!product){
            res.status(404).json({error: "Producto no encontrado"});
        }

        const {title, price, stock, category, description} = req.body;

        if(title) product.title = title;
        if(price) product.price = Number(price);
        if(stock) product.stock = Number(stock);
        if(category) product.category = category;
        if(description) product.description = description;
        res.json({
            message: "Producto actualizado", product
        })
    } catch (error) {
        res.status(500).json({error: "Error en servidor"})
    }
})

//eliminar producto

app.delete("/produtcs/:pid", async (req, res) => {
    try{
        const pid = req.params.pid;
        const deleted = await manager.deleteProduct(pid);

        if(!deleted){
            return res.status(404).json({ error: "Producto no encontrado"});
        }

        res.json({message: "Producto eliminado"});

    }catch(err){
        res.status(500).json ({ "error:" : err.message });
    }
})
