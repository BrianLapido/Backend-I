const passport = require("passport");
const {verifyToken} = require("../utils/jwt.js")
const {usersDAO} = require("../dao/mongoUsers.js");

const requireAuth = async (req, res, next)=>{
    try {
        const token = req.signedCookies?.currentUser

        if(!token){
            return res.redirect("/?error=No autorizado")
        };

        const payload = verifyToken(token)
        const user= await usersDAO.getUsersByEmail(payload.email)

        if(!user){
            return res.redirect("/?error=Usuario no encontrado")
        };

        req.user=user
        next()

    } catch (error) {
        return res.redirect("/?error=Token invalido o expirado")
    };
};

const passportCall = (strategy) => {
    return async (req, res, next) =>{
        passport.authenticate(strategy, {session:false}, (error, user, info)=> {
            if(error){
                return next(error)
            };

            if(!user){
                return res.status(401).json({message: info?.message || "No autorizado"})
            };

            req.user = user
            next()
        })(req, res, next)
    }
}

module.exports = {
    passportCall,
    requireAuth
}



