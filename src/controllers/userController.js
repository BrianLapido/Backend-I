const {users} = require("../dao/models/usuariosModel.js")
const bcrypt = require ("bcrypt")
const {generateToken} = require("../utils/jwt.js")

async function loginUser(req, res) {

    const { email, password} = req.body
    
    if(!email || !password){    
        return res.redirect("/api/users/login?error=Debe completar todos los campos")
    }
    
    const user = await users.findOne({email})

    if(!user){
        res.redirect("/api/users/login?error=El usuario no existe!")
    }

    const isValidPassword = bcrypt.compareSync(password, user.password)
    
    if(!isValidPassword){
        return res.redirect("/api/users/login?error=Contraseña incorrecta")
    }

    const token = generateToken(user)

    res.cookie("currentUser" , token, {signed: true, httpOnly: true})
    res.redirect("/current")


}

async function registerUser(req, res) {

        const {first_name, last_name, email, password, age, role} = req.body

         if(!first_name || !last_name || !email || !password || !age){
        return res.redirect("/api/users/register?error=Faltan datos obligatorios")
    }
    
    const userExist = await users.findOne({email})
    
    if(userExist){
        return res.redirect("/api/users/register?error=El usuario ya existe")
    }
    
    const hashedPass = bcrypt.hashSync(password, 10)

     const newUser = await users.create({
        first_name,
        last_name,
        age,
        email,
        role,
        password: hashedPass
    })


    const token = generateToken(newUser)

    res.cookie("currentUser" , token, {
        signed: true, 
        httpOnly: true,
        maxAge:3600000
    });

     res.redirect("/register/success");
}

module.exports={
    loginUser,
    registerUser
}