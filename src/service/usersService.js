const {usersDAO} = require("../dao/mongoUsers.js");
const bcrypt = require("bcrypt");
const {generateToken} = require("../utils/jwt.js");
const {sendWelcomeEmail} = require("./emailService.js")

class userService{
    
static async loginUserServices({email, password}){
    if(!email || !password){
        throw new Error("Debe completar los campos")
    };
    
    const user = await usersDAO.getUsersByEmail(email)
    if(!user){
        throw new Error("Usuario no encontrado")
    };

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if(!isValidPassword){
        throw new Error("Contraseña incorrecta")
    };

    const token = generateToken({
        id: user._id,
        name: user.first_name,
        last_name:user.last_name,
        email:user.email,
        role:user.role
    })
    return {user, token};

};

static async registerUserService(userData){
    const {first_name, last_name, email, age, password} = userData
    if(!first_name || !last_name || !email || !age || !password){
        throw new Error ("Todos los campos son requeridos");
    };

    const userExist = await usersDAO.getUsersByEmail(email)
    if(userExist){
        throw new Error("Ya existe un usuario con ese email. Intente con otro!")
    };

    const hashedPass = bcrypt.hashSync(password, 10)

    const newUser = await usersDAO.createUser({
        first_name,
        last_name, 
        email, 
        age,  
        password:hashedPass
    });

    const token = generateToken({
        id: newUser._id,
        email: newUser.email,
    });

    await sendWelcomeEmail({
        dest: user.email,
        name: user.first_name
    })

    return generateToken ({newUser, token});
}
}



module.exports= {userService}