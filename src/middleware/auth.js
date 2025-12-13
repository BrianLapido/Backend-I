
/* const {verifyToken}= require("../utils/jwt.js") */

/* function requireAuth (req, res, next){
    try {
        const token = req.signedCookies.currentUser
        if(!token){
            return res.redirect("/?error=Debe iniciar sesión")
        }

        const decoded = verifyToken(token)
        req.user = decoded
        next()

    } catch (error) {
        return res.redirect("/")
    }
} */

function checkAuth({ mustBeLoggedIn }) {
    return (req, res, next) => {

        const token = req.signedCookies.currentUser
        const isLogged = !!token

        if(mustBeLoggedIn && !isLogged){
            return res.redirect("/?error=Debe estar logueado")
        }
        if(!mustBeLoggedIn && isLogged){
            return res.redirect("/current")
        }
        next()
    }
};

module.exports= {
    checkAuth,
    //requireAuth
};