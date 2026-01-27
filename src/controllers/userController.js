const {userService} = require("../service/usersService.js")

class userController{
    static async loginUser(req, res){
    try {
        const {token} = await userService.loginUserServices(req.body)

        res.cookie("currentUser", token, {
            signed: true,
            httpOnly: true
        });

        res.redirect("/current")
        
    } catch (error) {
        /* res.redirect(`/?error=${error.message}`) */
        res.sendServerError(error.message);
    };
};

    static async registerUser (req, res) {
    try {
        const token= await userService.registerUserService(req.body);

        res.cookie("currentUser", token, {
            signed: true,
            httpOnly: true,
            maxAge: 3600000
        })
        /* res.sendSuccess("Usuario registrado correctamente") */
        res.redirect("/current?success=Usuario creado correctamente ")

    } catch (error) {
        res.redirect(`/register?error=${error.message}`)
        /* res.sendServerError(error.message); */
    };
};
}



module.exports={userController}
