const {Router} = require("./router")
const {userController} =require("../controllers/userController.js")

class userRouter extends Router{
    init(){
        this.post("/register", userController.registerUser);

        this.post("/login", userController.loginUser)
    };
}

module.exports= new userRouter().getRouter()




// const {Router} = require("express")
// const {userController} = require("../controllers/userController.js")

// const userRouter = Router();

// userRouter.post("/register", userController.registerUser);

// userRouter.post("/login", userController.loginUser);
