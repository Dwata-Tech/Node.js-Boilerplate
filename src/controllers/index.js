
const { loginController, registerController, verifyOTP, sendOTP, registerUserUsingGoogle, registerUserUsingLinkedIn, registerUserUsingFacebook, logoutController, forgotPasswordController, changePasswordController } = require("./auth.controller")

const { findUserById, findUserByEmail, updateUserStatus, updateUserDetails } = require("./user.controller")

const { courseListController, studentEnrollCourse, studentUnderstandingCourse, questionsListController, addAnswerController, updateAnswerOfGroupController, createGroupController, groupAnswerController,
    wordCloudListController, reportsListController } = require("./course.controller")

const { listPlansController, planDetailsController, createSubscriptionController, fetchSubscriptionDetailsController, cancelSubscriptionController } = require("./subscription.controller")

const { addDiscussionController, getDiscussionItemsController, updateDiscussionItemsController } = require("./discussion.controller")

module.exports = {
    loginController,
    registerController,
    registerUserUsingGoogleController: registerUserUsingGoogle,
    registerUserUsingLinkedInController: registerUserUsingLinkedIn,
    registerUserUsingFacebookController: registerUserUsingFacebook,
    logoutController: logoutController,
    findUserByIdController: findUserById,
    findUserByEmailController: findUserByEmail,
    updateUserStatusController: updateUserStatus,
    updateUserDetailsController: updateUserDetails,
    verifyOTPController: verifyOTP,
    sendOTPController: sendOTP,
    listPlansController,
    planDetailsController,
    createSubscriptionController,
    fetchSubscriptionDetailsController,
    cancelSubscriptionController,
    courseListController,
    courseEnrollController: studentEnrollCourse,
    courseUnderstandingController: studentUnderstandingCourse,
    addDiscussionController,
    getDiscussionItemsController,
    updateDiscussionItemsController,
    questionsListController,
    addAnswerController,
    updateAnswerOfGroupController,
    createGroupController,
    groupAnswerController,
    wordCloudListController,
    reportsListController,
    forgotPasswordController,
    changePasswordController
}