import mongoose from "mongoose"

export const mongoDb = async (url, dbName) =>{
    
    
    try {
        await mongoose.connect(
            process.env.MONGO_URL,{
                dbName
            }
        )
        console.log("Conectado a base de datos")
    } catch (error) {
        console.error("Error al conectar con base de datos", error)
    }
}