const {usersDAO} = require("../dao/mongoUsers.js");
const bcrypt = require("bcrypt");
const {generateToken} = require("../utils/jwt.js");
const {sendWelcomeEmail} = require("./emailService.js");
const {CartService} = require("./cartsService.js");

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
        _id: user._id,
        name: user.first_name,
        first_name: user.first_name,
        last_name:user.last_name,
        email:user.email,
        role:user.role,
        cart: user.cart
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
        password:hashedPass,
    });

    const newCart = await CartService.createCartService(newUser._id);

    newUser.cart = newCart._id;
    await newUser.save();

    
    await sendWelcomeEmail({
        dest: newUser.email,
        name: newUser.first_name,
    });

    const token = generateToken({
        _id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role: newUser.role,
        cart: newCart._id
    });
    
    return token;
}
}



module.exports= {userService}
