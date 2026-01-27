const mongoose = require("mongoose");

const usuariosCollection = `users`;

const usuariosSchema = new mongoose.Schema({
    first_name: {type:String, require:true},
    last_name: {type:String, require:true},
    email: {type: String, require:true, unique: true},
    age: Number,
    password: {type:String, require: true},
    role: {type: String, require:true, default: `user`},
    cart:{
        type:[
            {
                cart:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"carts",
                    require:true
                },

                quantity:{
                    type:Number,
                    default: 1,
                    min: 0
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