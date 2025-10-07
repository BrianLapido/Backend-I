const fs = require("fs");

class ProductManager{
    constructor(path){
        this.path = path;
    }

//metodos

async readFile(){
    try{
        const data = await fs.promises.readFile(this.path, "utf-8")
        return JSON.parse(data);
    }catch{
        return []; // devuelve un arreglo vacio si no encuentra el archivo
    }
};

async writeFile(products){
    await fs.promises.writeFile(this.path, JSON.stringify(products, null , "\t"));
}

async addProduct(productData){
    const products = await this.readFile();
    const newId = products.length > 0 
    ? Math.max(...products.map((p) => Number(p.id))) + 1
    : 1 ;

    const newProduct = {
        id: newId,
        title: productData.title,
        description: productData.description,
        code: productData.code,
        price: Number(productData.price),
        stock: Number(productData.stock),
        thumbnail: productData.thumbnail,
        category: productData.category
    }

    products.push(newProduct);
    await this.writeFile(products);

    return newProduct;
}

//obtener productos

async getProducts(){
    return await this.readFile();
}

//obtener producto mediante id

async getProductById(id){
    const products = await this.readFile();
    const product = products.find((p) => p.id === Number(id))  || null;
    return product;
}


async deleteProduct(id){
    const products= await this.getProducts();
    const index = products.findIndex(p => p.id === id);

    if(index === -1){
        return null;
    }

    const productDeleted = products[index];
    products.splice(index, 1);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

    return productDeleted;

}
}

module.exports = ProductManager;