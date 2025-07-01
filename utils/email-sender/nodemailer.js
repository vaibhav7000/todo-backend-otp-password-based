const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.TRANSPORTER_EMAIL}`,
        pass: `${process.env.TRANSPORTER_PASS}`
    }
})

async function transportEmail (userEmail, otp) {
    console.log("Email:", process.env.TRANSPORTER_EMAIL);
    console.log("Pass:", process.env.TRANSPORTER_PASS);
    try {
        const response = await transporter.sendMail({
            from: 'Todo Application',
            to: userEmail,
            subject: "OTP Code",
            text: "Your OTP is " + otp
        })

        return true;
    } catch (error) {
        throw error;
    }
}


module.exports = {transportEmail}