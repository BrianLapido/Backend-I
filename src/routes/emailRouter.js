const {Router} = require("./router.js")
const {EmailController} = require("../controllers/emailController.js")

class EmailRouter extends Router{
    init(){
        this.post("/", EmailController.sendEmailHbs)
    }
}

module.exports= new EmailRouter().getRouter()