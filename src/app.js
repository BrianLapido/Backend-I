const express = require("express");
const ProductManager = require("./dao/productsManager");


const PORT = 3000;
const app = express();

ProductManager.path= "./src/data/products.json"

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const managerProducts = new ProductManager("./src/data/products.json");

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost: ${PORT}`);
});


//obtener datos
app.get("/products", async (req, res) => {
    try{
        const products = await managerProducts.getProducts();
    
        res.json(products);
    }catch(err){
        res.status(500).json({error : err.message})
    }
});


//obtener producto por id

app.get("/products/:pid", async (req, res) => {
    try{
        const pid = req.params.pid;
        const product = await managerProducts.getProductById(pid)

        if(!product){
            return res.status(404).json({error: "Producto no encontrado"});
        }
        res.json(product); 

    }catch(err){
        res.status(500).json({error: err.message})
    }
});

//agregar producto

app.post("/products", async (req, res) => {
    try{ 
        const newProduct = await managerProducts.addProduct(req.body);
        res.status(201).json({message: "producto agregado", product: newProduct});
    }catch(err){
        res.status(400).json({"error:": err.message})
    }
})

//actualizar producto
app.put("/products", async (req, res) => {
    try {
        const pid = req.params.pid;
        const products = await managerProducts.getProducts();

        //buscar p por id
        const product = products.find(p => String(p.id) === String(pid));

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

app.delete("/products/:pid", async (req, res) => {
    try{
        const pid = req.params.pid;
        const deleted = await managerProducts.deleteProduct(pid);

        if(!deleted){
            return res.status(404).json({ error: "Producto no encontrado"});
        }

        res.json({message: "Producto eliminado"});

    }catch(err){
        res.status(500).json ({ "error:" : err.message });
    }
})
