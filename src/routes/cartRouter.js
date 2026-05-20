const {Router} = require("./router.js");
const{cartsController} = require ("../controllers/cartsController.js")
const {requireAuth} = require("../middleware/requireAuth.js");

class CartRouter extends Router{
    init(){
        this.get("/", cartsController.getCart);

        this.get("/current", requireAuth, cartsController.getCurrentCart);

        this.get("/:cid", cartsController.getCartById);

        this.post("/", requireAuth, cartsController.createCart);

        this.post("/products/:pid", requireAuth, cartsController.addProductToCart);

        this.put("/products/:pid", requireAuth, cartsController.updateProductQuantity);

        this.delete("/products", requireAuth, cartsController.clearCurrentCart);

        this.delete("/products/:pid", requireAuth, cartsController.deleteProductFromCart);

        this.put("/:cid", cartsController.updateCart);

        this.delete("/:cid", cartsController.deleteCart); 
    }
   
}


module.exports = new CartRouter().getRouter()
