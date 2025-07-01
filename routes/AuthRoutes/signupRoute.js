const { Router }  = require("express");
const router = Router();
const { verifyEmailPassword, checkEmailUnique, checkOTP } = require("../../middlewares/AuthMiddlewares/signUpMiddleware.js")
const { sendOTP, addUserToDatabase } = require("../../controllers/AuthControllers/signupController.js");

router.post("/", verifyEmailPassword, checkEmailUnique, sendOTP);

router.post("/otp-verify", checkOTP, addUserToDatabase);

module.exports = router;