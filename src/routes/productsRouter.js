const {Router} = require("express");
const productsRouter = Router();
const { isValidObjectId } = require("mongoose");
const MongoProductsManager = require("../dao/mongoProductsManager.js")

//---------------------------Obtener todos los productos-----------------------------//
productsRouter.get("/", async (req, res) =>{
    let {limit, page}= req.query;
    try {
        let products = await MongoProductsManager.getProducts(limit, page);
        if(!products){
            res.setHeader(`Content-Type`, `application/json`)
            res.status(400).json({message: "Error en carga de productos"})
        }
        res.setHeader(`Content-Type`, `application/json`)
        return res.status(200).json({products})
    } catch (error) {
        console.log(error)
        res.setHeader(`Content-Type`, `application/json`)
        return res.status(400).json({message: "Error:", error})
    }
});

//--------------------------Obtener productos por parametro-----------------------//
productsRouter.get("/:id", async (req, res) =>{

    let {id} = req.params;

    if(!isValidObjectId(id)){
        res.setHeader(`Content-Type`, `application/json`)
        return res.status(404).json({message: "ID invalido"})
    };

    try {
        let getBy = await MongoProductsManager.getProductsBy({_id:id});
        if(!getBy || getBy.length === 0){
            res.setHeader(`Content-Type`, `application/json`)
            return res.status(404).json({message: `No existe un producto con ese id`})
        }

        res.setHeader(`Content-Type`, `application/json`)
        return res.status(200).json({"Producto seleccionado" : getBy});

    } catch (error) {
        console.log(error)
        res.setHeader(`Content-Type`, `application/json`)
        return res.status(400).json({message: "Error:", error})
    };
});

//----------------------------agregar producto--------------------------------//

productsRouter.post("/", async (req, res) => {
    
   try{ 
   
    const {title, price, stock, thumbnail, code, description}=req.body;
        if(!title || !price){
            res.setHeader(`Content-Type`, `application/json`)
            res.status(400).json({error: `Titulo y precio son requeridos`})
            return 
        }
        
        const exist= await MongoProductsManager.getProductsBy({title})
        if(exist.length > 0){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ya existe el producto ${title}`})
        }

        let newProduct = await MongoProductsManager.createProduct({
            title,
            price,
            stock,
            thumbnail, 
            code,
            description
        });
        res.setHeader('Content-Type','application/json');
        res.status(201).json({
            message:"Nuevo producto agregado",
            product: newProduct
        })
        // socket.emit("nuevoProducto", newProduct)

    }catch(err){
        res.setHeader('Content-Type','application/json');
        res.status(400).json({message: "Error", err});
    }
    
})

//---------------------------actualizar producto---------------------------//
productsRouter.put("/:id", async (req, res) => {
    
    let {id} = req.params;
    
    if(!isValidObjectId(id)){
        res.setHeader('Content-Type','application/json');
        res.status(404).json({message: `Ingrese un id valido de MongoDB`});
    };

    try {
        const products = await MongoProductsManager.getProductsBy({_id:id});

        if(!products || products.length === 0){
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({message: `Producto con id ${id} no fue encontrado`});
        };

       let updateProduct = req.body;

       if(updateProduct._id){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({message: `No se puede modificar el id`});
       };
        
       let modifiedProduct = await MongoProductsManager.updateProduct(id, updateProduct);

        res.setHeader('Content-Type','application/json');
        return res.status(200).json({"Producto modificado": modifiedProduct});

    } catch (error) {
        res.setHeader('Content-Type','application/json');
        res.status(500).json({error: "Error en servidor"})
    };
});


//-------------------eliminar producto----------------------//
productsRouter.delete("/:id", async (req, res) => {

    const {id}= req.params;
    try{
        const deleted = await MongoProductsManager.deleteProduct({_id:id});

        if(!deleted){
            return res.status(404).json({ error: "Producto no encontrado"});
        }
        return res.json({message: `Producto eliminado`, product: deleted});

    }catch(err){
        res.status(500).json ({ "error:" : err.message });
    }
})

module.exports = {productsRouter};