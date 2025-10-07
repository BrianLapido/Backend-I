const {Router} = require("express");
const CartManager = require("../dao/cartManager");

const cartRouter = Router()
const managerCartPorducts = new CartManager("./src/data/carts.json");

//-------------------------------Crear carrito------------------------------//
    cartRouter.post("/", async (req, res) =>{
        try {
            const cart = await managerCartPorducts.createCart();
            res.status(201).json({message: "carrito creado", cart});
        } catch (error) {
            res.status(500).json({message: "Error al crear carrito", error});
        }
    });


//--------------------------Obtener carrito--------------------------------//
    cartRouter.get("/", async(req, res) =>{
        try {
            const cart = await managerCartPorducts.readFile();
            res.setHeader("Content-Type", "application/json");
            return res.json(cart);
        } catch (error) {
            res.status(501).json({message:"Error al obtener carritos", error});
        }
    });

//----------------------------Obtener carrito por id---------------------------------//
    cartRouter.get("/:cid", async (req, res) =>{
        const cid = Number(req.params.cid);
        const cart = await managerCartPorducts.getCartById(cid);

        if(!cart){
            return res.status(404).json({error: "Carrito no encontrado"});
        }
        res.json(cart);
    });


//----------------------------Agregar producto al carrito-------------------------//

    cartRouter.post("/:cid/product/:pid", async(req, res) =>{
        const cid = Number(req.params.cid);
        const pid = Number(req.params.pid);

        const updateCart = await managerCartPorducts.addProductToCart(cid, pid);
        
        if(!updateCart){
            return res.status(404).json({error: "Carrito no encontrado!"})
        }
        res.json({message: "Producto agregado al carrito", cart: updateCart});
    });

//---------------------------actualizar producto-----------------------------//
    cartRouter.put("/:cid", async (req, res) => {
        try {
            const cid = Number(req.params.cid);
            const cartProducts = await managerCartPorducts.readFile();
            
            //buscar carrito por id
            const cartProduct = cartProducts.find(p => p.id === cid);

            if(!cartProduct){
                res.status(404).json({error: "Carrito no encontrado"});
            };

            const {id, products} = req.body;
            if(id) cartProduct.id = id;
            if(products) cartProduct.products = products;

            await managerCartPorducts.writeFile(cartProducts);
            
            res.json({
                message:"Carrito actualizado", cartProduct
            });
        } catch (error) {
            res.status(500).json({error: "Error en servidor"})
        }
    });


//--------------------------Eliminar carrito----------------------------//
cartRouter.delete("/:cid", async (req, res) => {
    try{
        const cid = Number(req.params.cid);
        const deleted = await managerCartPorducts.deleteCart(cid);

        if(!deleted){
            return res.status(404).json({ error: "Carrito no encontrado"});
        }

        res.json({message: `Carrito numero ${cid} eliminado`});

    }catch(err){
        res.status(500).json ({ "error:" : err.message });
    }
})


module.exports = {cartRouter};