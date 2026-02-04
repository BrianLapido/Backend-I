const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

    const productSchema = new mongoose.Schema({
            title: {
                type:String, 
                required:true,
                trim: true
                },

            price: {
                type:Number,
                required:true,
                min: 0
                },
            
            description:{
                type: String,
                required: true
                },
            
            code: {
                type:String,
                unique:true
                },

            stock:{
                type: Number,
                required: true,
                min:0
            },
            
            thumbnail: {
                type: String,
                default: ""
            },

            category: {
                type: String,
                required: true
            },

            
    });

    productSchema.plugin(mongoosePaginate); 

    const productModel = mongoose.model("products", productSchema);

module.exports={productModel}