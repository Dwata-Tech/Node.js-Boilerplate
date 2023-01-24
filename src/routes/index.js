const moment = require("moment")

const { authRouter } = require("./auth.routes")

const { userReouter } = require("./user.routes")

const express = require("express")
const { subscriptionRouter } = require("./subscription.routes")
const { courseRouter } = require("./course.routes")
const { discussionRouter } = require("./discussion.routes")


const router = express.Router()

// healthcheck
router.get("/healthcheck", (request, response) => {
    response.status(200).json({
        time: moment().format("DD-MMM-YYYY HH:mm:ss"),
        projectName: process.env.PROJECT_NAME
    })
})


router.use(authRouter)
router.use(userReouter)
router.use(subscriptionRouter)
router.use(courseRouter)
router.use(discussionRouter)


module.exports.mainRouter = router