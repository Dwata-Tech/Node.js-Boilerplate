// library imports
const { v4 } = require("uuid");

// custom imports
const { responseHandler } = require("./../utils/responseHandler");
const { getCourseByCourseId } = require("../data/course_dao");
const { addDiscussionData, getDiscussionByCourseId, updateDiscussionByCourseIdAndUserId } = require("../data/discussion_dao");
const { getUserById } = require("../data/user_dao");
const { logger } = require("../utils/logger");

async function addDiscussion({ userId, question, courseId, traceId }, response) {
  let id = v4();
  try {
    // Prepare query for get course by courseId
    let getCourse = await getCourseByCourseId(courseId);

    if (getCourse && getCourse.length > 0) {
      // Prepare query for add discussion
      await addDiscussionData(id, question, userId, courseId);
      logger.info("Add discussion success", traceId)
      responseHandler(response, 200, { message: "Success" }, null);
    } else {
      // If course not found
      logger.error("service.addDiscussion() Error: course not found", traceId)
      responseHandler(response, 404, null, { message: "course not found" });
    }
  } catch (error) {
    // exception block
    logger.error("service.addDiscussion() Error: error in addDiscussion service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
}

async function getDiscussionItems({ courseId, traceId }, response) {
  try {
    // Prepare query for get course by courseId
    let getCourse = await getCourseByCourseId(courseId);



    if (getCourse && getCourse.length > 0) {
      // Prepare query for get discussion by courseId
      let getDiscussionData = await getDiscussionByCourseId(courseId);
      let getResponse = []
      logger.debug(`service.getDiscussionItems() Get discussion by courseId data count: ${getDiscussionData.length}`, traceId)
      if (getDiscussionData && getDiscussionData.length > 0) {
        for (let i = 0; i < getDiscussionData.length; i++) {
          // Prepare query for get user by id
          let questionUserData = await getUserById(getDiscussionData[i]?.question_by);
          // Prepare query for get user by id
          let answerUserData = await getUserById(getDiscussionData[i]?.answer_by);
          getResponse.push({
            id: getDiscussionData[i]?.id,
            question: getDiscussionData[i]?.question,
            questionBy: {
              userId: questionUserData[0]?.user_id,
              userName: questionUserData[0]?.first_name,
            },
            questionAt: getDiscussionData[i]?.question_at,
            answer: getDiscussionData[i]?.answer,
            answerBy: {
              userId: answerUserData[0]?.user_id,
              userName: answerUserData[0]?.first_name,
            },
            answeredAt: getDiscussionData[i]?.answer_at,
          })
        }
        logger.info("Get discussion items success", traceId)
        responseHandler(response, 200, { data: { discussionItems: getResponse } }, null);
      } else {
        // If discussion items not found
        logger.error("service.getDiscussionItems() Error: discussion items not found", traceId)
        responseHandler(response, 404, null, { message: "discussion items not found" });
      }
    } else {
      // If course not found
      logger.error("service.getDiscussionItems() Error: course not found", traceId)
      responseHandler(response, 404, null, { message: "course not found" });
    }
  } catch (error) {
    // exception block
    logger.error("service.getDiscussionItems() Error: error in getDiscussionItems service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
}

async function updateDiscussionItems({ id, answer, courseId, userId, traceId }, response) {
  try {
    // Prepare query for get course by courseId
    let getCourse = await getCourseByCourseId(courseId);

    if (getCourse && getCourse.length > 0) {
      // Prepare query for update discussion by course and user
      await updateDiscussionByCourseIdAndUserId(answer, userId, id, courseId);
      logger.info("Update discussion items success", traceId)
      responseHandler(response, 200, { message: "Success" }, null);
    } else {
      // If course not found
      logger.error("service.getDiscussionItems() Error: course not found", traceId)
      responseHandler(response, 404, null, { message: "course not found" });
    }
  } catch (error) {
    // exception block
    logger.error("service.updateDiscussionItems() Error: error in updateDiscussionItems service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
}

module.exports = {
  addDiscussion,
  getDiscussionItems,
  updateDiscussionItems
};