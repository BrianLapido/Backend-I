const { Router } = require("express");
const ProductManager = require("../dao/mongoProductsManager");
const {checkAuth, requireAuth} = require("../middleware/auth.js")
const {users} = require("../dao/models/usuariosModel.js")
const {passportCall} = require("../middleware/passportAuth.js")
const router = Router();

router.get("/",checkAuth({mustBeLoggedIn: false}), async (req, res) =>{
    const error = req.params.error;
    try { 

        res.render("login", {error});

    } catch (error) {
        res.setHeader("Content-Type", "application/json")
        res.status(400).json({message: "Debe registrarse", error: error.message})
    };
});

router.get("/register", checkAuth({mustBeLoggedIn:false}), async (req, res) =>{
    const error = req.params.error
    try {
        res.render("register", {error});

    } catch (error) {
        res.setHeader("Content-Type", "application/json")
        res.status(401).json({message: "Error al registrarse", error: error.message})
    };
});

router.get("/current" ,passportCall(`jwt`) , async (req, res) =>{
    try { 
        const user = await users.findById(req.user.id).lean()
        res.render("current", {user});
        
    } catch (error) {
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({message: "Error interno", error: error.message})
    };
});

router.get("/products" ,checkAuth({mustBeLoggedIn:true}), async (req, res) =>{
  try {
    let{limit, page}= req.query;

    let {
        docs:products,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage} = await ProductManager.getProducts(limit, page);
  
      res.render("products", {
        user: req.session.user,
        products,
        totalPages, 
        hasPrevPage, 
        hasNextPage, 
        prevPage, 
        nextPage
      });
  } catch (error) {
        console.error("Error:", error.message); 
        res.status(500).send("Error al cargar los productos.");
  }
})


module.exports = {router};
