const { Router }  = require("express");
const { verifyEmailSchema, checkUserExistInDatabase, verifyPassword, sendOTPForSignIn } = require("../../middlewares/AuthMiddlewares/signinMiddleware.js");
const { verifyOTPSignIn, provideJWT } = require("../../controllers/AuthControllers/signinController.js")
const router = Router();


router.post("/", verifyEmailSchema, checkUserExistInDatabase, verifyPassword, sendOTPForSignIn);

router.post("/otp-verify", verifyOTPSignIn, provideJWT)

module.exports = router;

// providing signin with otp or password based both functionalites should be provided
// Option of forget password
// After successfull signin provide jwt to the user based on the email