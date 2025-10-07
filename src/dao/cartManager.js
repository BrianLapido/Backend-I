const fs =require("fs");

    class CartManager {
    constructor(path){
        this.path= path
    };

    //Leer archivo
    async readFile(){
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async writeFile(carts){
        await fs.promises.writeFile(this.path, JSON.stringify(carts , null, "\t"))
    }

    //Crear carrito
    async createCart(){
       const cart = await this.readFile();

        const newCart = {
            id: cart.length > 0 ? cart[cart.length - 1].id + 1 : 1, 
            products: []
        };

        cart.push(newCart);

        await this.writeFile(cart);
        return newCart;

    };

    async getCartById(id){
       try {
         const carts = await this.readFile();
        //  const carts = JSON.parse(data);
          
         const cart = carts.find(c => Number(c.id) == Number(id))
         return cart || null;

       } catch (error) {
            console.error(error.message)
       }
    };

    async addProductToCart(cartId, productId){
        const carts = await readFile()
        const cart = carts.find(c => c.id === Number(cartId));
        
        if(!cart){
            return null
        };

        if(!Array.isArray(cart.products)){
            cart.products = [];
        }
        //Buscar si el producto ya esta en el carrito

        const existProduct = cart.products.findIndex((p) => 
            p.product ===Number(productId));

        if(existProduct !== -1){
            cart.products[existProduct].quantity += 1
        }else{
            cart.products.push({product: Number(productId) , quantity: 1})
        };

        await this.writeFile(carts)
        return cart;
    }

    //Eliminar carrito
    async deleteCart(id){
    const carts = await this.readFile();
    const cartEliminado = carts.filter((c) => c.id !== id)

    if(carts.length === cartEliminado.length){
        return false;
    } ;

    await this.writeFile(cartEliminado)
    return true;
}
}

module.exports = CartManager;