const nodemailer = require("nodemailer");

require("dotenv").config()

const MailSender = async(email, title, body) => {
    try {
        // transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
        // mailsend

        const info = await transporter.sendMail({

            from: `code help`,
            to: email,
            subject: title,
            html: body,
        })

        return info;




    } catch (error) {
        console.log("error in mail send")
        console.log(error.message);
    }
}

module.exports = MailSender;