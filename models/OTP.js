//import mongoose to creat a schema
const mongoose = require("mongoose");
// const nodemailer = require("nodemailer");
const MailSender = require('../Utile/MailSender');

require('dotenv').config();

const OTPschema = new mongoose.Schema({
    email: {
        type: String,

    },
    otp: {
        type: Number,

    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 10 * 60,
    },

})



// a function ->to send mail
async function sendVerificationEmail(email, otp) {
    try {
        const mailRseponse = await MailSender(email, "varification email for stadyNotion", otp);
        console.log("email send success fully : ", mailRseponse);

    } catch (error) {
        console.log("error occured while sending mails: ", error);
        // throw error;
    }
}

OTPschema.post("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);

    next;
})
module.exports = mongoose.model("otp", OTPschema);