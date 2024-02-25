const nodemailer = require("nodemailer");
const errorHandler = require("../../../handlers/error_handler");

function resetPasswordMail(email, passwordResetToken) {
    const transport = nodemailer.createTransport({
        host: process.env.node_mailer_url,
        port: 465,
        secure: true,
        auth: {
            user: process.env.node_mailer_username,
            pass: process.env.node_mailer_password
        }
    });
    const message = {
        from: process.env.node_mailer_username,
        to: email,
        subject: "Password Reset - Digishop",
        html: `<p>A password change request was created for your Digishop account, Click on this link to change your password : <a href="${process.env.FRONTEND_URL}/auth/reset-password/?token=${passwordResetToken}" target="_blank">${process.env.FRONTEND_URL}/auth/reset-password/?token=${passwordResetToken}</a><br>Ignore if this request was not made by you!`
    }
    transport.sendMail(message, (error) => {
        if (error) {
            errorHandler(error)
            return false
        }
    });
    return true
}

module.exports = resetPasswordMail