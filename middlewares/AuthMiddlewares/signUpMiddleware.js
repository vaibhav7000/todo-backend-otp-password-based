const { emailSchema, passwordSchema } = require("../../utils/types.js");
const { User } = require("../../db/database.js");


function verifyEmailPassword(req, res, next) {
    const { email, password } = req.body;

    let result = emailSchema.safeParse({
        email
    });

    if(!result.success) {
        res.status(401).json({
            msg: "Your credentials are invalid or missing (email)."
        })
        return
    }

    result = passwordSchema.safeParse({
        password
    })

    if(!result.success) {
        res.status(401).json({
            msg: "Your credentials are invalid or missing (password)."
        })
        return
    }

    next();
}

async function checkEmailUnique(req, res, next) {
    const {email} = req.body;

    try {
        const response = await User.findOne({
            email
        })

        if(response) {
            res.status(409).json({
                msg: "Email already exist"
            })
            return
        }
    } catch (error) {
        next(error);
    }

    next();
}

function checkOTP(req, res, next) {

    const { email, otp } = req.body;
    const finalOTP = parseInt(otp)

    if(!finalOTP) {
        res.status(401).json({
            msg: "Invalid OTP"
        })
        return
    }

    if(!store[email]) {
        res.status(400).json({
            msg: "OTP is expired"
        })
        return
    }

    if(store[email] != finalOTP) {
        res.status(401).json({
            msg: "Incorrect OTP"
        })

        return
    }

    next();

}

module.exports = {
    verifyEmailPassword, checkEmailUnique, checkOTP
}