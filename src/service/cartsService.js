const {cartsDAO} = require("../dao/mongoCarts.js")   
const {isValidObjectId} = require("mongoose")
const {productModel} = require("../dao/models/productsModel.js");

class CartService{
//--------------------Obtener carritos--------------------//
static async getCartService(){
    const getCarts = await cartsDAO.getAllCarts()
    return getCarts
};

//-------------------Obtener carrito por ID-----------------//
static async getCartByIdService(cid){
    if(!isValidObjectId(cid)){
        throw new Error("ID invalido")
    };

    const cart = await cartsDAO.getCartByIdRaw(cid)

    if(!cart){
        throw new Error("No existe el carrito")
    };

    return cart
};

//--------------------Crear carrito------------------//
static async createCartService(userId){
    const cartExist = await cartsDAO.getCartByUser(userId);

    if(cartExist){
       return cartExist 
    };

    const newCart = await cartsDAO.createNewCart({user:userId, products:[]})

    if(!newCart){
        throw new Error("Error al crear el carrito")
    };
    
    return newCart;

};

//--------------------agregar producto a carrito-------------------------//
static async addProductToCartService(cid, pid){
     console.log("SERVICE START", { cid, pid });
    if(!isValidObjectId(cid) || !isValidObjectId(pid)){
        throw new Error ("ID de carrito o producto invalido")
    };
    
    const cart = await cartsDAO.getCartByIdRaw(cid)
    console.log("CART FOUND:", cart?._id, cart?.products);

    if(!cart){
        throw new Error("Carrito no encontrado")
    };

    const productExist = await productModel.findById(pid);

    if(!productExist){
        throw new Error("Producto no encontrado")
    };

    
    const productInCart = cart.products.find(
        p => p.product && p.product.toString() === pid
    );

    if(productInCart){
        productInCart.quantity += 1; 

    }else{
        cart.products.push({
            product: pid,
            quantity: 1
        });
    };

    cart.markModified("products");

    await cart.save();
    return await cart.populate("products.product");
};

//---------------------Actualizar carrito----------------------//
static async updateCartService(cid, data){
    const updateCart= await cartsDAO.updateCart(cid, data, {new: true})
        if(!updateCart){
            throw new Error("Carrito no encontrado")
        };
        return updateCart.toObject();
};

//--------------------Eliminar carrito--------------------------//
static async deleteCartService(cid){
    const deleteCart = await cartsDAO.deleteCart(cid);

    if(!deleteCart){
        throw new Error("No se pudo eliminar el carrito")
    };

    return deleteCart;
};
}


module.exports = {
   cartService: CartService
}
