const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.TRANSPORTER_EMAIL}`,
        pass: `${process.env.TRANSPORTER_PASS}`
    }
})

async function transportEmail (userEmail, otp) {
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