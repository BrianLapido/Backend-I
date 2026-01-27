const {getCurrentSessionService} = require ("../service/sessionsService.js")

class sessionController{
static async current(req, res){

    const user = await getCurrentSessionService(req.user);

    res.status(200).json({
        status: "success",
        user
  });
};

static async logOut(req, res){
    
    res.clearCookie("currentUser", {
        httpOnly: true,
        sameSite: "lax"
    });

    return res.redirect("/");
};
}



module.exports = {sessionController};