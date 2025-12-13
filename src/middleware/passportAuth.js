const { error, info } = require("console");
const { userInfo } = require("os");
const passport = require("passport");
const { Strategy } = require("passport-jwt");

/* const passportAuth = passport.authenticate(`jwt`, {session:false, failureRedirect: `/failureLogin?error=4`}) */
const passportCall = (Strategy) => {
    return async (req, res, next) =>{
        passport.authenticate(Strategy, {session:false}, (error, user, info)=> {
            if(error){
                return res.redirect(`/login?error=8`)
            }

            if(!user){
                return res.redirect(`/login?error=${info}`)
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

module.exports = {passportCall}

