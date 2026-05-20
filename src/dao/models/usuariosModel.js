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
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    }
},

{
        timestamps:true,
        collection:"users"
    })

const usersModel = mongoose.model(usuariosCollection, usuariosSchema)

module.exports= {usersModel};
