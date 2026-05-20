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

//-------------------Obtener carrito por usuario-----------------//
static async getCartByUserService(userId){
    if(!isValidObjectId(userId)){
        throw new Error("ID de usuario invalido")
    };

    const cart = await cartsDAO.getCartByUser(userId);

    if(!cart){
        return await this.createCartService(userId);
    };

    return await cart.populate("products.product");
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
    if(!isValidObjectId(cid) || !isValidObjectId(pid)){
        throw new Error ("ID de carrito o producto invalido")
    };
    
    const cart = await cartsDAO.getCartByIdRaw(cid)

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

//--------------------actualizar cantidad de producto-------------------------//
static async updateProductQuantityService(userId, pid, quantity){
    if(!isValidObjectId(userId) || !isValidObjectId(pid)){
        throw new Error("ID de usuario o producto invalido")
    };

    const newQuantity = Number(quantity);
    if(!Number.isInteger(newQuantity) || newQuantity < 1){
        throw new Error("La cantidad debe ser un numero mayor a 0")
    };

    const cart = await this.getCartByUserService(userId);
    const productInCart = cart.products.find(
        p => p.product && p.product._id.toString() === pid
    );

    if(!productInCart){
        throw new Error("Producto no encontrado en el carrito")
    };

    productInCart.quantity = newQuantity;
    cart.markModified("products");
    await cart.save();

    return await cart.populate("products.product");
};

//--------------------eliminar producto del carrito-------------------------//
static async deleteProductFromCartService(userId, pid){
    if(!isValidObjectId(userId) || !isValidObjectId(pid)){
        throw new Error("ID de usuario o producto invalido")
    };

    const cart = await this.getCartByUserService(userId);
    const initialLength = cart.products.length;

    cart.products = cart.products.filter(
        p => p.product && p.product._id.toString() !== pid
    );

    if(cart.products.length === initialLength){
        throw new Error("Producto no encontrado en el carrito")
    };

    await cart.save();
    return await cart.populate("products.product");
};

//--------------------vaciar carrito-------------------------//
static async clearCartService(userId){
    if(!isValidObjectId(userId)){
        throw new Error("ID de usuario invalido")
    };

    const cart = await this.getCartByUserService(userId);
    cart.products = [];
    await cart.save();

    return cart;
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
   CartService,
   cartService: CartService
}
