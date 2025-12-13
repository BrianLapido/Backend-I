const {Router} = require("express")
const {loginUser, registerUser} = require("../controllers/userController.js")

const userRouter = Router();

userRouter.get("/register", (req, res)=>{
    const {error} = req.query;
    res.render("register", {error})
});

userRouter.get("/login", (req, res)=>{
    const {error} = req.query;
    res.render("login", {error})
});

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

module.exports={userRouter}