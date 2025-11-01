const { default: mongoose } = require("mongoose");
const cartModel=require("./models/cartModel.js");
const productModel = require("./models/productsModel.js");

class MongoCartManager{

    static async getCarts(){
        try {
            const carts= await cartModel.find().lean()
            return carts;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    static async getCartBy(cid){
       try {
         return await cartModel.findById(cid);
       } catch (error) {
            console.error("Error al filtrar los carritos", error)
            throw error;
       }
    };

    static async createCart(email = null){
        try {
                let newCart = await cartModel.create({email, products:[] });
                return newCart
            
        } catch (error) {
            console.error("Error al crear el carrito");
            throw error;
        };
    };

     static async addProductToCart(cid, pid){
         
         if(!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)){
             throw new Error("Id inválido")
            };
            
            
        const cart = await cartModel.findById(cid);
        if(!cart) return null;


        const productsExist= await productModel.findById(pid);
        if(!productsExist){
            throw new Error("Producto no encontrado")
        }
        
        const existingProduct = cart.products.find(p => p.product.toString() === pid)

        if(existingProduct){
            existingProduct.quantity += 1
        }else{
            cart.products.push({product:pid, quantity: 1})
        }

        cart.markModified("products");
        return await cart.populate("products.product");
    }
   


    static async updateCart(cid, dataUpdate){
        try {
            const updateCart= await cartModel.findByIdAndUpdate(cid, dataUpdate, {new: true})
            if(!updateCart) throw new Error("Carrito no encontrado");
            return updateCart.toObject();
        } catch (error) {
             console.error("Error al actualizar el carrito!", error.message);
             throw error;
        };
    };

    static async deleteCart(id){
        try {
            return await cartModel.findByIdAndDelete(id)
        } catch (error) {
            console.error("No se pudo eliminar el carrito", error);
        };
    };
}; 

module.exports=MongoCartManager