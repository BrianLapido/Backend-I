const passport = require("passport")
const jwt = require("passport-jwt")

const JWTStrategy = jwt.Strategy
const ExtractJWT =jwt.ExtractJwt

const cookieExtractor = req =>{
    let token = null
    if(req && req.signedCookies){
        token = req.signedCookies[`currentUser`]
    }

    return token
}

const initializePassport = () =>{
    passport.use(`jwt`, new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.PRIVATE_KEY
    }, async (jwt_payLoad, done) => {
        try {
            return done(null, jwt_payLoad)
        } catch (error) {
            return done(error)
        }
    }));
};

module.exports = {initializePassport}