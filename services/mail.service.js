const nodemailer = require("nodemailer");

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_AUTH_USER,
                pass: process.env.MAIL_AUTH_PASSWORD
            }
        })
    }

    async sendMail(email, code) {
        await this.transporter.sendMail({
            from: process.env.MAIL_AUTH_USER,
            to: email,
            subject: "Your verification code",
            text: "",
        html: `
                <div>
                    <h1>Your verification code is ${code}</h1>
                </div>
            `
        });
    }
}

module.exports = new MailService();