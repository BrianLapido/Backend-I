const { Router } = require("./router.js");
const {requireAuth} = require("../middleware/requireAuth.js");
const {requireGuest} = require("../middleware/requireGuest.js");
const { viewsController } = require("../controllers/viewsController.js");

class ViewsRouter extends Router{
    init(){
        this.get("/",requireGuest, viewsController.getLogin);

        this.get("/register", requireGuest, viewsController.getRegister);

        this.get("/current" , requireAuth, viewsController.getCurrent);

        this.get("/products" ,requireAuth, viewsController.getProducts) 
    }
}


module.exports = new ViewsRouter().getRouter()
