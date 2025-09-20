const fs = require("fs");
const crypto = require("crypto");


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
    await fs.promises.writeFile(this.path, JSON.stringify(products, null , 2));
}

async addProduct(productData){
    const products = await this.readFile();

    const exist= products.find(p => p.code === productData.code )
    if(exist){
        throw new Error(`Ya existe el producto con el code ${productData.code}`);
    }

    const newProduct = {
        id: crypto.randomUUID(),
        title: productData.title,
        description: productData.description,
        code: productData.code,
        price: Number(productData.price),
        stock: Number(productData.stock),
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
    const product = products.find((p) => p.id === id);
    return product || null;
}
//eliminar producto

async deleteProduct(id){
    const products = await this.readFile();
    const productoFiltrado = products.filter((p) => String(p.id) !== String(id))

    if(productoFiltrado.length === products.length){
        return false
    };

    await this.writeFile(productoFiltrado)
    return true;
}
}

module.exports = ProductManager;