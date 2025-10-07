const {Router} = require("express");
const ProductManager = require("../dao/productsManager.js");
// const socket = io();
const productsRouter = Router();
const managerProducts = new ProductManager("./src/data/products.json")

//---------------------------Obtener todos los productos-----------------------------//
productsRouter.get("/", async (req, res) =>{
    try {
        let products = await managerProducts.readFile();

        res.setHeader(`Content-Type`, `aplication/json`)
        return res.status(200).json({products})
    } catch (error) {
        console.log(error)
        res.setHeader(`Content-Type`, `aplication/json`)
        return res.status(400).json({message: "Error:", error})
    }
})

//--------------------------Obtener productos por id-----------------------//
productsRouter.get("/:pid", async (req, res) =>{
    try {
        const pid = Number(req.params.pid);
        let product = await managerProducts.getProductById(pid);
    

        if(!product){
            return res.status(404).json({message: "Producto no encontrado"})
        }

        res.setHeader(`Content-Type`, `application/json`)
        return res.status(201).json({ product })
    } catch (error) {   

        res.setHeader(`Content-Type`, `application/json`);
        return res.status(500).json({message: `error producto no encontrado:`, error})
        
    }
})



//----------------------------agregar producto--------------------------------//

productsRouter.post("/", async (req, res) => {
    
   try{ 
   
    const {title, price, stock, thumbnail, code, description}=req.body;
        if(!title || !price){
            res.setHeader(`Content-Type`, `application/json`)
            return res.status(400).json({error: `Titulo y precio son requeridos`})
        }
        
        const products = await managerProducts.getProducts();
        const exist= products.find(p => p.title === title)
        if(exist){
            res.setHeader('Content-Type','application/json');
            res.status(400).json({error:`Ya existe el producto ${title}`})
        }
    
    
        const newProduct = await managerProducts.addProduct({
            title,
            price,
            description,
            thumbnail,
            stock,
            code
        });

        req.io.emit("nuevoProducto", newProduct); 
        res.status(201).json({message: "Nuevos producto: " , newProduct});

    }catch(err){
        res.status(400).json({"error:": err.message})
    }
})

//---------------------------actualizar producto---------------------------//
productsRouter.put("/:pid", async (req, res) => {
    try {
        const pid = Number(req.params.pid);
        const updateData = req.body;

        const products = await managerProducts.getProducts();
        
        //buscar p por id
        const product = products.findIndex(p => p.id === pid);

        if(product === -1){
            res.status(404).json({error: "Producto no encontrado"});
        }
       
        
        const updateProduct = {
        ...products[product],
        ...updateData,
        price: updateData.price ? Number(updateData.price) : products[product].price,
        stock: updateData.stock ? Number(updateData.stock) : products[product].stock
        }

        products[product] = updateProduct;
        await managerProducts.writeFile(products);
        
        req.io.emit("productoActualizado", updateProduct);

        res.json({
            message:"Producto actualizado", product: updateProduct
        })
    } catch (error) {
        res.status(500).json({error: "Error en servidor"})
    }
})


//-------------------eliminar producto----------------------//
productsRouter.delete("/:pid", async (req, res) => {
    try{
        const pid = Number(req.params.pid);
        const deleted = await managerProducts.deleteProduct(pid);

        if(!deleted){
            return res.status(404).json({ error: "Producto no encontrado"});
        }
        req.io.emit("productoEliminado", deleted)
        res.json({message: `Producto eliminado`, product: deleted});

    }catch(err){
        res.status(500).json ({ "error:" : err.message });
    }
})

module.exports = {productsRouter};