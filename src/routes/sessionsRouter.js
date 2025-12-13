const {Router} = require("express");
const routerSession = Router()


routerSession.get("/logout", (req, res) => {
    console.log("Cookies actuales:", req.cookies); 
    
    res.clearCookie("currentUser", {
        httpOnly: true,
        sameSite: "lax"
    });

    return res.redirect("/");
});

/* routerSession.get("/logout", async (req, res) =>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).send("Error al cerrar sesion")
        };

        res.redirect("/");
    })
})
 */

module.exports = {routerSession};