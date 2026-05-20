
const getCurrentSessionService = async (user) =>{
    if(!user){
        throw new Error("Usuario no logueado");
    };

    return {
        id: user._id || user.id,
        email: user.email,
        role: user.role,
        cart: user.cart
    };
};

module.exports = {getCurrentSessionService}
