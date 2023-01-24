const express = require("express")
const { authMiddleware } = require("../utils/authMiddleware")

const router = express.Router()

const userController = require("./../controllers")

// Fetch user details using user ID
router.route("/user/:userId").get(authMiddleware, userController.findUserByIdController)

// Check is user exist with this email
router.route("/user/:email/isExist").get(authMiddleware, userController.findUserByEmailController)

// Check user status
router.route("/user/status").post(authMiddleware, userController.updateUserStatusController)

// update user details
router.route("/user").put(authMiddleware, userController.updateUserDetailsController)

module.exports.userReouter = router