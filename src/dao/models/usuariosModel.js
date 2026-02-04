const mongoose = require("mongoose");

const usuariosCollection = `users`;

const usuariosSchema = new mongoose.Schema({

    first_name: {type:String, required:true},

    last_name: {type:String, required:true},

    email: {type: String, required:true, unique: true},

    age: Number,

    password: {type:String, required: true},

    role: {type: String, required:true, default: `user`},

    cart:{
        type:[
            {
                type: mongoose.Schema.Types.ObjectId,
                
                ref: "carts",

                quantity:{
                    type:Number,
                    default: 1,
                    min: 1
                }
            }
        ]
    }
},

{
        timestamps:true,
        collection:"users"
    })

const usersModel = mongoose.model(usuariosCollection, usuariosSchema)

module.exports= {usersModel};