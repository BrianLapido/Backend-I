const jwt = require("jsonwebtoken");

function generateToken (user){
    const payload ={
        id: user._id || user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart
    };

    return jwt.sign(payload, process.env.PRIVATE_KEY,{
        expiresIn:"1h"
    })
};

function verifyToken(token){
    return jwt.verify(token, process.env.PRIVATE_KEY)
};

module.exports={
    verifyToken,
    generateToken,
}

