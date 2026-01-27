const {Router} = require("./router")
const {userController} =require("../controllers/userController.js")

class userRouter extends Router{
    init(){
        this.post("/register", userController.registerUser);

        this.post("/login", userController.loginUser)
    };
}

module.exports= new userRouter().getRouter()