const {productModel}=require("./models/productsModel.js");

class productsDAO{

    static async getAll(limit = 10, page = 1){
        return await productModel.paginate({},{
            limit,
            page,
            lean: true
        })
    };

    static async getProductsById(id){
        return await productModel.findById(id).lean()
    };

    static async getProductsByFilter(filtro={}){
        return await productModel.find(filtro).lean()
    };

    static async createProduct(product){
        return await productModel.create(product)
    };

    static async updateProduct(id, dataUpdate){
        return await productModel.findByIdAndUpdate(id, dataUpdate, {new: true}).lean()
    };

    static async deleteProduct(id){
        return await productModel.findByIdAndDelete(id)
    };
}; 

module.exports={productsDAO}

