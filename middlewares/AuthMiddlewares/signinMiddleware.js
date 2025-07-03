const { User } = require("../../db/database.js");
const { transportEmail } = require("../../utils/email-sender/nodemailer.js");
const { generateOTP } = require("../../utils/otp.js");
const { emailSchema } = require("../../utils/types.js");
const store = require("../../store/redis.js");

function verifyEmailSchema(req, res, next){
    const { email } = req.body;
    const result = emailSchema.safeParse({
        email
    })

    if(!result.success) {
        res.status(401).json({
            msg: "Invalid Email format"
        })
        return
    }

    next();
}

async function verifyPassword(req, res, next) {
    const { securityType } = req.body;
    const isOTP = securityType === 'otp' ? true: false;

    if(!isOTP) {
        // checking for password
        try {
            const response = await checkPassword(req);
            if(!response) {
                res.status(403).json({
                    msg: "Invalid Password"
                })
                return
            }

            res.status(200).json({
                msg: "Login Successful"
            })
        } catch (error) {
            next(error);
        }

        return;
    }

    next();
}

async function checkUserExistInDatabase(req, res, next) {
    const { email } = req.body;
    try {
        const response = await User.findOne({
            email
        })

        if(!response) {
            // user does not exist in database
            res.status(403).json({
                msg: "Email does not exist in database, Rather first SignIn first"
            })
            return
        }

        next();
    } catch (error) {
        next(error);
    }
}

async function sendOTPForSignIn(req, res, next) {
    const { email } = req.body;
    const otp = generateOTP();

    // clearing
    if(store[email]) {
        clearTimeout(store[email].setTimoutId);
        delete store[email];
    }

    try {
        const response = await transportEmail(email, otp);
        store[email] = {
            otp
        }

        let setTimoutId = setTimeout(function() {
            delete store[email];
        }, 5 * 60 * 1000);

        store[email] = {
            ...store[email], setTimoutId
        }

        res.status(200).json({
            msg: "OTP send"
        })
    } catch (error) {
        next();
    }
}

async function checkPassword(req) {
    const {email, password} = req.body;

    try {
        const response = await User.findOne({
            email, password
        })

        if(!response) {
            return false
        }

        return true
    } catch (error) {
        throw error;
    }
}

module.exports = {
    verifyEmailSchema, verifyPassword, checkUserExistInDatabase, sendOTPForSignIn
}