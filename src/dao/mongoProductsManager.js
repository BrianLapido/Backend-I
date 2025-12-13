const productModel=require("./models/productsModel.js");

class MongoProductsManager{

    static async getProducts(limit = 12, page = 1){
        try {
            const productos= await productModel.paginate({}, {limit, page, lean: true})
            return productos;
        } catch (error) {
            console.error("Error al obtener los productos", error);
            throw error;
        }
    };

    static async getProductsBy(filtro={}){
       try {
         return await productModel.find(filtro);
       } catch (error) {
            console.error("Error al filtrar los productos", error)
            throw error;
       }
    };

    static async createProduct(product){
        try {
            let newProduct = await productModel.create(product);
            return newProduct.toObject()
        } catch (error) {
            console.error("Error al agregar el producto!", error);
            throw error;
        };
    };

    static async updateProduct(id, dataUpdate){
        try {
            return await productModel.findByIdAndUpdate(id, dataUpdate, {new: true})
        } catch (error) {
             console.error("Error al actualizar el producto!", error);
        };
    };

    static async deleteProduct(id){
        try {
            return await productModel.findByIdAndDelete(id, {new: true})
        } catch (error) {
            console.error("No se pudo eliminar producto", error);
        };
    };
}; 

module.exports=MongoProductsManager
