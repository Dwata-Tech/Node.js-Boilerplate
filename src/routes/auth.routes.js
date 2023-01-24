const express = require("express")
const { token } = require("morgan")
const { authMiddleware } = require("../utils/authMiddleware")

const router = express.Router()

const authController = require("./../controllers")

// Login user 
router.route("/login").post(authController.loginController)

// register user
router.route("/user").post(authController.registerController)

// register - signin user using google access token
router.route("/register/google").post(authController.registerUserUsingGoogleController)

// register - signin user using linkedin access token
router.route("/register/linkedin").post(authController.registerUserUsingLinkedInController)

// register - signin user using facebook access token
router.route("/register/facebook").post(authController.registerUserUsingFacebookController)

// Send verification OTP  <<--- protected route --->>
router.route("/verifyOTP").post(authMiddleware, authController.verifyOTPController)

// Verify verification OTP  <<--- protected route --->>
router.route("/sendOTP").post(authMiddleware, authController.sendOTPController)

// Logout user and invalidate session using sesssion ID  <<--- protected route --->>
router.route("/logout").post(authMiddleware, authController.logoutController)

// Forgot password
router.route("/forgotPassword").post(authController.forgotPasswordController)

// Change password
router.route("/changePassword").post(authController.changePasswordController)

module.exports.authRouter = router
