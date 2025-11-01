const mongoose = require("mongoose");

const cartModel = mongoose.model(
    "carts",
    new mongoose.Schema(
        {
            role: 
                {
                type: String,
                default: "cart"
            },
            
            email:{
                type: String,
                unique: true,
                require: false,
                sparse: true
            },
             

            products: {
                type:[
                    {
                        product:{
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "products",
                            require: true
                        },

                        quantity: {
                            type: Number,
                            default: 1,
                            min :0
                        }
                    }
                ]
            }
        },
        {
            timestamps: true,
            collection: "carts"  
        }
    )
);

 /* await cartModel.deleteMany({})  */
module.exports= cartModel