const mongoose = require("mongoose")

class MongoSingleton{
    
    static #instance

    constructor(){
        mongoose.connect(process.env.MONGO_URL,{dbName:process.env.DB_NAME})
    };
        
    
    static getInstance(){
    
    if(this.#instance){
            console.log("Ya estas conectado!")
            return this.#instance
        }

        this.#instance = new MongoSingleton();
        console.log("Conectado");
        return this.#instance;
    };
}

module.exports= {MongoSingleton}