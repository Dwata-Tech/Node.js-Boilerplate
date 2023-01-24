const express = require("express")

const router = express.Router()

const { authMiddleware } = require("../utils/authMiddleware")

const discussionController = require("./../controllers")

// Get discussion item
router.route("/course/:courseId/discussion").get(authMiddleware, discussionController.getDiscussionItemsController);

// Add discussion
router.route("/course/:courseId/discussion").post(authMiddleware, discussionController.addDiscussionController);

// Update discussion
router.route("/course/:courseId/discussion").put(authMiddleware, discussionController.updateDiscussionItemsController);


module.exports.discussionRouter = router