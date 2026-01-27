const {Router} = require("./router.js");
const{passportCall} = require("../middleware/requireAuth")
const{sessionController} = require ("../controllers/sessionController.js");
const jwt = require("passport-jwt")

class SessionRouter extends Router{
    init(){
        this.get("/current", passportCall(jwt), sessionController.current);

        this.get("/logout", sessionController.logOut);
    }
}

module.exports = new SessionRouter().getRouter()