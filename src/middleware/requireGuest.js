const requireGuest = (req, res, next) => {
    const token = req.signedCookies?.currentUser

    if(token){
        return res.redirect("/current")
    }

    next()
};

module.exports={requireGuest}