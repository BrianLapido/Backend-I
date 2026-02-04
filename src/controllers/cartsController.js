const {cartService} = require ("../service/cartsService.js");

class cartsController{
    
static async getCart(req, res){
    try {
        const carts = await cartService.getCartService()
        res.status(200).json({carts})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

static async getCartById(req, res){
    try {
        const {cid} = req.params;
        const cartById = await cartService.getCartByIdService(cid)
        res.status(200).json({cartById})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

static async createCart(req, res){
    try {
        /* const {userId} = req.body; */
        const userId= req.user._id

        const newCart = await cartService.createCartService(userId);

        res.status(201).json({
            message:"Carrito creado",
            cart: newCart
        });
    } catch (error) {
        res.status(400).json({error: error.message})
    };
};

static async addProductToCart(req, res){
    try {
        console.log("PARAMS:", req.params);
        const {cid, pid}= req.params
        const addProduct = await cartService.addProductToCartService(cid, pid)
        
        res.status(200).json({
        message: "Producto agregado",
        addProduct
    })        
    } catch (error) {
        res.status(400).json({error: error.message})
    }
};

static async updateCart(req, res){
    try {
    const {cid} = req.params;
    const update = await cartService.updateCartService(cid, req.body)
    res.status(200).json({
            message: `Carrito actualizado con exito`,
            cart:update
        });        
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

static async deleteCart(req, res){
    try {
        const {cid} = req.params
        const cartDelete = await cartService.deleteCartService(cid)
        res.status(200).json({
            message: "Carrito eliminado con exito",
            cart: cartDelete
        });
    } catch (error) {
        res.status(404).json({error: error.message})
    }
};
}


module.exports = {cartsController}