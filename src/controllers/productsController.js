const {productsService} = require ("../service/productsService.js")

    class productsController{

static async getProducts (req, res){
    const {limit, page} = req.query;

    try {
        const products = await productsService.getProductsService(limit, page);
        res.status(200).json({products})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

static async getByID (req, res){

    try {
        const{id} = req.params;
        const productId = await productsService.getProductsByIdService(id);
        res.status(200).json({productId})

    } catch (error) {
        res.status(404).json({error: error.message})
    }
};

static async createProduct(req, res){
    try {
        const product = await productsService.addProductService(req.body)
        res.status(200).json({
            message:`producto creado`,
            product: product
        });

    } catch (error) {
        res.status(501).json({error: error.message})        
    }
};


static async updateProduct(req, res) {
    try {
        const {id} = req.params;
        const update= await productsService.findUpdateProductService(id, req.body);
        res.status(201).json({
            message: `Producto actualizado con exito`,
            product:update
        });

    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

static async deleteProduct(req, res){

    try {
        const{id} = req.params;
        const productDelete = await productsService.deleteProductService(id);
        res.status(200).json({
            message:`Producto eliminado`,
            product: productDelete});

    } catch (error) {
        res.status(404).json({error: error.message})
    }
};
}


module.exports={productsController}