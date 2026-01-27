// controllers/emailController.js
const { sendWelcomeEmail } = require("../service/emailService.js");

class EmailController {

    static async sendEmailHbs(req, res) {
        try {
            const { dest, name } = req.body;

            if (!dest || !name) {
                return res.sendUserError("Faltan datos obligatorios");
            }

            await sendWelcomeEmail({dest,name});

            res.sendSuccess("Email enviado correctamente");
        } catch (error) {
            res.sendServerError(error.message);
        }
    }
}

module.exports = { EmailController };
