const {createTransport} = require("nodemailer");

const transporter = createTransport({
    service: "gmail",
    port: 465,
    secure:true,
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORDGOOGL
    }
});

module.exports ={transporter}