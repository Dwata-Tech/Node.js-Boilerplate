const { login, register, verifyOTP, sendOTP, logoutUser, registerUserUsingGoogle, registerUserUsingLinkedIn, registerUserUsingFacebook, forgotPassword, changePassword } = require("./auth.service")

const { findUserById, findUserByEmail, updateUserStatus, updateUserDetails, findUserByUserId, findValidSessionBySessionId } = require("./user.service")

const { courseList, courseEnroll, courseUnderstanding, questionsList, addAnswer, updateAnswerOfGroup, createGroupOfStudent, getAnswerOfGroup, wordCloudList, reportsList } = require("./course.service")

const { listPlans, getPlanDetails, createSubscription, fetchSubscriptionDetails, cancelSubscription } = require("./subscription.service")

const { addDiscussion, getDiscussionItems, updateDiscussionItems } = require("./discussion.service")

module.exports = {
    login,
    register,
    findUserById,
    findUserByEmail,
    updateUserStatus,
    updateUserDetails,
    findUserByUserId,
    verifyOTP,
    sendOTP,
    logoutUser,
    findValidSessionBySessionId,
    registerUserUsingGoogle,
    listPlans,
    getPlanDetails,
    createSubscription,
    fetchSubscriptionDetails,
    cancelSubscription,
    registerUserUsingLinkedIn,
    courseList,
    courseEnroll,
    courseUnderstanding,
    addDiscussion,
    getDiscussionItems,
    updateDiscussionItems,
    questionsList,
    addAnswer,
    updateAnswerOfGroup,
    createGroupOfStudent,
    getAnswerOfGroup,
    wordCloudList,
    reportsList,
    registerUserUsingFacebook,
    forgotPassword,
    changePassword
}