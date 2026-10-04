const nodemailer = require("nodemailer");
const env = require("dotenv");

env.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});


async function sendMail({ from = "Secure Meetings <securemeetings.sahal@gmail.com>", to, subject, text, html }) {
    const response = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
    });

    return response;
}


module.exports = sendMail;