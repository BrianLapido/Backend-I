const {productsDAO} = require("../dao/mongoProducts.js")

class viewsController{
    static async getLogin (req, res){
        const {error} = req.query;
        res.render("login", {error});
    };

    static async getRegister(req, res){
        const {error} = req.query;
        res.render("register", {error});
    };

    static async getCurrent(req, res){
        res.render("current", {
        user: req.user
        });
    }

    static async getProducts(req, res){
        try {
    let{limit=10, page=1}= req.query;

    let {
        docs:products,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage} = await productsDAO.getAll(limit, page);
  
      res.render("products", {
        user: req.user,
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
    }

}

module.exports= {viewsController}