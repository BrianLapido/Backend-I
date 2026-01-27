const {usersModel}=require("./models/usuariosModel.js");

class usersDAO{

    static async getAll(){
        return await usersModel.find().lean()
    };

    static async getUsersByEmail(email){
        return await usersModel.findOne({email}).lean()
    };

    static async getUsersById(id){
        return await usersModel.findById(id).lean()
    };

    static async getUsersByFilter(filtro={}){
        return await usersModel.find(filtro).lean()
    };

    static async createUser(user){
        return await usersModel.create(user)
    };

    async updateUser(id, dataUpdate){
        return await usersModel.findByIdAndUpdate(id, dataUpdate, {new: true}).lean()
    };

    static async deleteUser(id){
        return await usersModel.findByIdAndDelete(id)
    };
}; 

module.exports={usersDAO}
