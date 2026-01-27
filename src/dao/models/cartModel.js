const mongoose = require("mongoose");

const cartModel = mongoose.model(
    "carts",
    new mongoose.Schema(
        {   
            user:{
                type: mongoose.Schema.ObjectId,
                ref: "users",
                required: true,
                unique: true
            },
            
            products: {
                type:[
                    {
                        product:{
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "products",
                            required: true
                        },

                        quantity: {
                            type: Number,
                            default: 1,
                            min :1  
                        }
                    }
                ],
                default: []
            },
             
        },

        {
            timestamps: true,
            collection: "carts"  
        }
    )
);


module.exports= cartModel