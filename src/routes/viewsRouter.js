const { Router } = require("express");
const ProductManager = require("../dao/mongoProductsManager");

const router = Router();


router.get("/", async (req, res) =>{
    try {
        let {nombre} = req.query; 
        
        res.render("homepage", {
            nombre
        });
    } catch (error) {
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({message: "Error interno", error: error.message})
    };
});

router.get("/realTimeProducts", async (req, res) =>{
  try {
    let{limit, page}= req.query;

    let {
        docs:products,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage} = await ProductManager.getProducts(limit, page);
  
      res.render("realTimeProducts", {
          products, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage
      });
  } catch (error) {
        console.error("Error:", error.message); 
        res.status(500).send("Error al cargar los productos.");
  }
})


module.exports = {router};
