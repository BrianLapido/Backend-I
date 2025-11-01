const {Router} = require("express");
const MongoCartManager = require("../dao/mongoCartsManager");
const { default: mongoose } = require("mongoose");

const cartRouter = Router()
//-------------------------------Crear carrito------------------------------//
    cartRouter.post("/", async (req, res) =>{
        try {
            const {email} = req.body;
            const cart = await MongoCartManager.createCart(email);
            res.status(201).json({"New cart" : cart});
        } catch (error) {
            res.status(500).json({message: "Error al crear carrito", error: error.message});
        }
    });


//--------------------------Obtener carrito--------------------------------//
    cartRouter.get("/", async(req, res) =>{
        let {limit, page} = req.query; 
        try {
            let cart = await MongoCartManager.getCarts(limit, page);
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json(cart);
        } catch (error) {
            res.status(501).json({message:"Error al obtener carritos", error});
        }
    });

//----------------------------Obtener carrito por id---------------------------------//
    cartRouter.get("/:cid", async (req, res) =>{

        let {limit, page} = req.query;
        try {
            const {cid} = req.params;
            const cart = await MongoCartManager.getCartBy(cid, limit, page);
            
            if(!mongoose.Types.ObjectId.isValid(cid)){
                return res.status(404).json({message: "ID del carrito inválido"})
            };

            if(!cart){
                return res.status(404).json({error: "Carrito no encontrado"});
            }
            res.setHeader(`Content-Type`, `application/json`);
            res.status(201).json(cart);

        } catch (error) {
            res.setHeader(`Content-Type`, `application/json`);
            return res.status(500).json({message: `Error carrito no encontrado:`, error})
        }
    });


//----------------------------Agregar producto al carrito-------------------------//

    cartRouter.post("/:cid/product/:pid", async(req, res) =>{
       try {
         const {cid, pid} = req.params;
         const updateCart = await MongoCartManager.addProductToCart(cid, pid);
         
         if(!updateCart){
             return res.status(404).json({error: "Carrito no encontrado!"})
         }
         res.status(200).json({message: "Producto agregado al carrito", cart: updateCart});

       } catch (error) {
            res.status(500).json({error: "No se pudo agregar producto al carrito"})
       };
    });

//---------------------------actualizar producto-----------------------------//
    cartRouter.put("/:cid", async (req, res) => {
        try {
            const {cid} = req.params;
            const dataUpdate = req.body;
            const updateCart = await MongoCartManager.updateCart(cid, dataUpdate);
            

            if(!updateCart){
                res.status(404).json({error: "Carrito no encontrado"});
            };

            res.status(200).json({
                message: "Carrito actualizado",
                cart: updateCart
            })
            
        } catch (error) {
            res.status(500).json({message:"Error al actualizar carrito", error})
        }
    });



//--------------------------Eliminar carrito----------------------------//
cartRouter.delete("/:cid", async (req, res) => {
    try{
        const {cid} = req.params;
        const deletedCart = await MongoCartManager.deleteCart(cid);

        if(!deletedCart){
            return res.status(404).json({ error: "Carrito no encontrado"});
        }

        res.json({message: `Carrito numero ${cid} eliminado`, cart: deletedCart});

    }catch(err){
        res.status(500).json ({ "error:" : err.message });
    }
})


module.exports = {cartRouter};