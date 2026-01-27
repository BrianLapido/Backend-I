const jwt = require("jsonwebtoken")

const handlePolicies = policies => (req, res, next) =>{

    if(policies.includes("PUBLIC")) return next()

    let token= null

    if(req.headers.authorization){
        token= req.headers.authorization.split(" ")[1];
    }

    if(!token && res.signedCookies?.currentUser){
        token= res.signedCookies.currentUser
    };

    if(!token){
        return res.status(401).json({status: "error", error:"No autorizado"})
    };

    try {
        const user = jwt.verify(token, process.env.PRIVATE_KEY)

        if(!policies.includes(user.role?.toUpperCase())){
            return res.status(403).json({status:"error", error: "Prohibido"})
        };

        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({status: "error", error: "Token inválido"})
    };
    
}
    
    // const authCookies = req.signedCookies?.currentUser
    // if(!authCookies){
    //     return res.status(401).send({status: `error`, error:`No autorizado`})
    // };


    // let user;

    //  try {
    //     user= jwt.verify(token, process.env.PRIVATE_KEY)
    // } catch (error) {
    //     return res.status(401).json({status: error, message:"Token invalido"})
    // };


    // if(!policies.includes(user.role?.toUpperCase())){
    //     return res.status(403).send({status: `error`, error:`Acceso prohibido`})
    // };

    // req.user= user
    // next()


module.exports= {
    handlePolicies
}