const {Router} = require("./router.js")
const {productsController} = require("../controllers/productsController.js");

class ProductRouter extends Router{
    init(){
        this.get("/", productsController.getProducts);

        this.get("/:id", productsController.getByID);

        this.post("/", productsController.createProduct);

        this.put("/:id", productsController.updateProduct);

        this.delete("/:id", productsController.deleteProduct);
    }
}


module.exports = new ProductRouter().getRouter()