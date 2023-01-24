const express = require("express")
const { authMiddleware } = require("../utils/authMiddleware")

const router = express.Router()

const courseController = require("./../controllers")

// Course list
router.route("/course").get(authMiddleware, courseController.courseListController)

// Course enroll
router.route("/course/:courseId/attendance").put(authMiddleware, courseController.courseEnrollController)

// Course understanding
router.route("/course/:courseId/understanding").post(authMiddleware, courseController.courseUnderstandingController)

// Course wise question list
router.route("/course/:courseId/questions").get(authMiddleware, courseController.questionsListController)

// Add answer
router.route("/course/:courseId/answer").post(authMiddleware, courseController.addAnswerController)

// Update answer of group
router.route("/course/:courseId/group/:groupId/answer").post(authMiddleware, courseController.updateAnswerOfGroupController)

// Create group
router.route("/course/:courseId/groups").get(authMiddleware, courseController.createGroupController)

// Group answer
router.route("/course/:courseId/group/answers").get(authMiddleware, courseController.groupAnswerController)

// Word cloud list
router.route("/course/:courseId/world-cloud").get(authMiddleware, courseController.wordCloudListController)

// Report list
router.route("/course/:courseId/reports").get(authMiddleware, courseController.reportsListController)

module.exports.courseRouter = router