const store = require("../../store/redis.js");
const jwt = require("jsonwebtoken");
const { emailSchema } = require("../../utils/types.js");

function verifyOTPSignIn(req, res, next) {
    const { email, otp } = req.body;
    const finalOTP = parseInt(otp);

    const result = emailSchema.safeParse({
        email
    })


    if(!result.success) {
        res.status(401).json({
            msg: "Email invalid"
        })
        return
    }

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

    if(store[email].otp != finalOTP) {
        res.status(401).json({
            msg: "Incorrect OTP"
        })

        return
    }

    clearTimeout(store[email].setTimoutId);
    delete store[email];

    next();
}

function provideJWT(req, res, next) {
    const {email} = req.body;

    const token = jwt.sign(JSON.stringify({
        email
    }), process.env.jwt_Pass);

    res.status(200).json({
        token
    })
}


module.exports = {
    verifyOTPSignIn, provideJWT
}