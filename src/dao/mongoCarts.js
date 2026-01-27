const cartModel=require("./models/cartModel.js");

class cartsDAO{

    static async getAllCarts(){
        return await cartModel.find().lean()
        
    };

    static async getCartById(cid){
        return await cartModel.findById(cid).lean()
    };

    static async getCartByIdRaw(cid){
        return await cartModel.findById(cid)
    };

    static async createNewCart(cartData){
        return await cartModel.create(cartData)
    };

    static async updateCart(cid, data){
        return await cartModel.findByIdAndUpdate(cid, data, {new: true})
    };

    static async deleteCart(cid){
        return await cartModel.findByIdAndDelete(cid)

    };

    static async saveCart(cart){
        return await cart.save()
    }
};


module.exports={cartsDAO}