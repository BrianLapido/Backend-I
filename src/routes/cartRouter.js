const {Router} = require("./router.js");
const{cartsController} = require ("../controllers/cartsController.js")

class CartRouter extends Router{
    init(){
        this.get("/", cartsController.getCart);

        this.get("/:cid", cartsController.getCartById);

        this.post("/", cartsController.createCart);

        this.post("/:cid/products/:pid", cartsController.addProductToCart);

        this.put("/:cid", cartsController.updateCart);

        this.delete("/:cid", cartsController.deleteCart); 
    }
   
}


module.exports = new CartRouter().getRouter()