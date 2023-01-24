const express = require("express")

const { authMiddleware } = require("../utils/authMiddleware")

const router = express.Router()

const subscriptionController = require("./../controllers")

// Fetch list of subscription plans
router.route("/plans").get(authMiddleware, subscriptionController.listPlansController)

// Fetch plan details using plan Id
router.route("/plans/:id").get(authMiddleware, subscriptionController.planDetailsController)

// Start user subscription
router.route("/subscribe").post(authMiddleware, subscriptionController.createSubscriptionController)

// Cancel subscrtipion if it is active 
router.route("/subscribe/:subscriptionId/cancel").post(authMiddleware, subscriptionController.cancelSubscriptionController)

// Fetch subscritpion details using subscription ID
router.route("/subscribe/:subscriptionId").get(authMiddleware, subscriptionController.fetchSubscriptionDetailsController)

module.exports.subscriptionRouter = router