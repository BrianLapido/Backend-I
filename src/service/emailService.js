const {transporter} = require("../utils/email.js");
const hbs = require("nodemailer-express-handlebars");
const path = require("path")

const hbsConfig = {
        viewEngine: {
        extName: `.hbs`,
        partialsDir: path.resolve(`./src/views`),
        defaultLayout: false,
    },
        viewPath: path.resolve(`./src/views`),
        extName: `.hbs`
};

    transporter.use(`compile`, hbs.default(hbsConfig));
    
    const sendWelcomeEmail = async ({dest, name}) =>{
        return transporter.sendMail({
            from: `TechStore ${transporter.options.auth.user}`,
            to: dest,
            subject: `¡Bienvenido!`,
            template: `email`,
            context:{
                text: `¡Hola ${name}! Bienvenido a TechStore`,
                email: dest
            }
        })
    }
    module.exports = {sendWelcomeEmail}