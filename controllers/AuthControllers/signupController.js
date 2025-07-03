const store = require("../../store/redis.js");
const { generateOTP } = require("../../utils/otp.js");
const { transportEmail } = require("../../utils/email-sender/nodemailer.js");
const { User } = require("../../db/database.js");

async function sendOTP(req, res, next) {
    const { password, email } = req.body;
    const otp = generateOTP();
    console.log(otp);

    if(store[email]) {
        clearTimeout(store[email].setTimoutId)
        delete store[email];
    }

    try {
        await transportEmail(email, otp);

        store[email] = {
            email, otp, password
        }

        const setTimoutId = setTimeout(function() {
            delete store[email]; // deleting this key-value pair
        }, 5 * 60 * 1000);

        store[email] = {
            ...store[email], setTimoutId
        }

        res.status(200).json({
            msg: "OTP send successfully"
        })

    } catch (error) {
        next(error);
    }
}

async function addUserToDatabase(req, res, next) {
    const { email } = req.body;

    const { password } = store[email]

    delete store[email];

    clearTimeout(store[email].setTimoutId);

    try {
        const finalUser = new User({
            email, password
        })

        const response = await finalUser.save();

        res.status(200).json({
            msg: "User successfully added in database"
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    sendOTP, addUserToDatabase
}