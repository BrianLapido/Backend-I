const { Router } = require("express");
const ProductManager = require("../dao/productsManager");

const router = Router();
const managerProducts = new ProductManager("./src/data/products.json");


router.get("/", async (req, res) =>{
    let {nombre} = req.query; 

    res.render("homepage", {
        nombre
    });
});

router.get("/realTimeProducts", async (req, res) =>{
  try {
      let products = await managerProducts.getProducts()
  
      res.render("realTimeProducts", {
          products
      })
  } catch (error) {
        console.error("Error:", error.message); 
        res.status(500).send("Error al cargar los productos.");
  }
})


module.exports = {router};
