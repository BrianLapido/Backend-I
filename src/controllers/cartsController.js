const {CartService} = require ("../service/cartsService.js");
class cartsController{
    
static async getCart(req, res){
    try {
        const carts = await CartService.getCartService()
        res.status(200).json({carts})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

static async getCartById(req, res){
    try {
        const {cid} = req.params;
        const cartById = await CartService.getCartByIdService(cid)
        res.status(200).json({cartById})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

static async getCurrentCart(req, res){
    try {
        const userId = req.user._id || req.user.id;
        const cart = await CartService.getCartByUserService(userId);

        res.status(200).json({
            message: "Carrito obtenido",
            cart
        });
    } catch (error) {
        res.status(400).json({error: error.message})
    }
};

static async createCart(req, res){
    try {
        /* const {userId} = req.body; */
        const userId= req.user._id || req.user.id

        const newCart = await CartService.createCartService(userId);

        res.status(201).json({
            message:"Carrito creado",
            cart: newCart
        });
    } catch (error) {
        res.status(400).json({error: error.message})
    };
};


static async addProductToCart(req, res) {
  try {
    const userId = req.user._id || req.user.id;
    const { pid } = req.params;

    const cart = await CartService.createCartService(userId);

    const result = await CartService.addProductToCartService(cart._id, pid);

    res.status(200).json({
      message: "Producto agregado",
      result
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

static async updateProductQuantity(req, res){
  try {
    const userId = req.user._id || req.user.id;
    const {pid} = req.params;
    const {quantity} = req.body;

    const cart = await CartService.updateProductQuantityService(userId, pid, quantity);

    res.status(200).json({
      message: "Cantidad actualizada",
      cart
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

static async deleteProductFromCart(req, res){
  try {
    const userId = req.user._id || req.user.id;
    const {pid} = req.params;

    const cart = await CartService.deleteProductFromCartService(userId, pid);

    res.status(200).json({
      message: "Producto eliminado del carrito",
      cart
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

static async clearCurrentCart(req, res){
  try {
    const userId = req.user._id || req.user.id;
    const cart = await CartService.clearCartService(userId);

    res.status(200).json({
      message: "Carrito vaciado",
      cart
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

/* static async addProductToCart(req, res){

    try {
        const {cid, pid}= req.params
        
        const addProduct = await cartService.addProductToCartService(cid, pid)
        
        res.status(200).json({
            message: "Producto agregado",
            addProduct
        })        
        console.log("PARAMS:", req.params);
        console.log("CID:", cid);
        console.log("PID:", pid);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}; */

static async updateCart(req, res){
    try {
    const {cid} = req.params;
    const update = await CartService.updateCartService(cid, req.body)
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
        const cartDelete = await CartService.deleteCartService(cid)
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
