
const getCurrentSessionService = async (user) =>{
    if(!user){
        throw new Error("Usuario no logueado");
    };

    return {
        id: user._id,
        email: user.email,
        role: user.role
    };
};

module.exports = {getCurrentSessionService}