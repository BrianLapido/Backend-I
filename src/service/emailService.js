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
/* static async sendEmail(req, res, next){

        try {
            const {dest, name} = req.body
            const emailConfig = {
                from: process.env.EMAIL,
                to: dest,
                subject: `Bienvenido/a a Techstore`,
                html: `<h2>Hola ${name} gracias por registrarte</h2>`,
               
            };

            const response = await transporter.sendMail(emailConfig)
            res.json(response);

        } catch (error) {
            next(error)
        }
    }; */



    transporter.use(`compile`, hbs.default(hbsConfig));

    const sendWelcomeEmail = async ({dest, name}) =>{
        return transporter.sendMail({
            from: process.env.EMAIL,
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