const jwt = require("jsonwebtoken");

function generateToken (user){
    const payload ={
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role
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


// const jwt = require("jsonwebtoken")

// function generateToken (user) {
//     const payload = {
//         id: user._id,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         email: user.email,
//         age: user.age,
//         role: user.role
// }
//     return jwt.sign(payload, process.env.PRIVATE_KEY, { expiresIn: "1h" });
// };

// function verifyToken(token){
//     return jwt.verify(token, process.env.PRIVATE_KEY)
// }

// const authToken = (req, res, next) =>{
//     const authHeader = req.headers.authorization

//     if(!authHeader){
//         return res.status(401).json({error: "Token invalido"})
//     }

//     const token = authHeader.split(` `)[1]

//     jwt.verify(token, process.env.PRIVATE_KEY, (err,credentials) =>{
//         if(err){
//             return res.status(403).json({error: "Token no verificado"})
//         }
//         req.user = credentials
//     })

//     next()
// } 

