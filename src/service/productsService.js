const { isValidObjectId } = require("mongoose");
const {productsDAO}= require("../dao/mongoProducts.js");


class productsService{
    //------------------------Obtener productos-----------------------//

static async getProductsService (){

        const products = await productsDAO.getAll()
        return products
};

//---------------------Obtener productos por id -------------------------//
static async getProductsByIdService(id){

    if(!isValidObjectId(id)){
        throw new Error("ID invalido")
    };

    const product = await productsDAO.getProductsById(id)

    if(!product){
        throw new Error("Producto no encontrado")
    }

    return product
};

//---------------------------Agregar productos------------------------//
static async addProductService(data){
    const {title, price}= data;

    if(!title || !price){
        throw new Error("Titulo y precio son requeridos")
    };

    const exist = await productsDAO.getProductsByFilter({title})
    if(exist.length > 0){
        throw new Error(`Ya existe el producto ${title}`)
    };

    let newProduct = await productsDAO.createProduct(data);

    return newProduct
};

//----------------------- Actualizar----------------------------//
static async findUpdateProductService(id, data){

    if(!isValidObjectId(id)){
        throw new Error("ID invalido")
    };

    if(data._id){
        throw new Error("No se puede modificar el ID")
    }

    const update = await productsDAO.updateProduct(id,data)

    if(!update){
        throw new Error(`No se pudo actualizar el producto`);
    };

    return update
};

//-----------------------Eliminar-----------------------------//
static async deleteProductService(id){
    
    if(!isValidObjectId(id)){
        throw new Error("ID invalido")
    }

    const deleted = await productsDAO.deleteProduct(id);
    
        if(!deleted){
            throw new Error("Producto no encontrado")
        }
        return deleted
};
}


module.exports={productsService}