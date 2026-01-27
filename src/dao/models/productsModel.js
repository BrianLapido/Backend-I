const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

    const productSchema = new mongoose.Schema({
            title: {
                type:String, 
                require:true,
                trim: true
                },

            price: {
                type:Number,
                require:true,
                min: 0
                },
            
            description:{
                type: String,
                require: true
                },
            
            code: {
                type:String,
                unique:true
                },

            stock:{
                type: Number,
                require: true,
                min:0
            },
            
            thumbnail: {
                type: String,
                default: ""
            },

            category: {
                type: String,
                require: true
            },

            
    });

    productSchema.plugin(mongoosePaginate); 

    const productModel = mongoose.model("products", productSchema);

module.exports={productModel}