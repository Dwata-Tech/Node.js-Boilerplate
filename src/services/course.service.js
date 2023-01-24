const { v4 } = require("uuid");
const { query } = require("../data/connect");
const { dbSchema, COURSE_TABLE, ID, ENROLLMENT_TABLE, IS_STUDENT_PRESENT, COURSE_ID, USER_ID, RESPONSE_TABLE, UNDERSTANDING, QUESTIONS_TABLE, QUESTION_ID,
    QUESTION, ANSWER, GROUP_RESPONSE_TABLE, GROUP_ID, GROUP_TABLE, NAME, USERS, SRTIKE_WORD, ANSWER_TABLE } = require("../data/dbConstants");
const { responseHandler } = require("../utils/responseHandler");
const { getCourseList, getCourseByCourseId } = require("./../data/course_dao");
const { updateAttendance, getEnrolmentDataByPresentStudent } = require("../data/enrolment_dao");
const { getResponseByCourseAndUser, updateUnderstandingRecord, createUnderstandingResponse, getStrikeWord, getResponseByCourseId } = require("../data/response_dao");
const { getQuestionsByCourseId } = require("../data/question_dao");
const { getAnswerByCourseAndUserId, updateAnswerRecord, addAnswerData, getAnswerByCourseIdAndUserId } = require("../data/answer_dao");
const { getGroupByGroupId, deleteGroupByCourseId, getGroupByCourseId, createGroup } = require("../data/group_dao");
const { updateAnswerOfGroupResponse, getResponseByGroupIdAndCourseId, addAnswerGroupResponse, getGroupResponseList, getGroupResponseListByCourseId } = require("../data/group_response_dao");
const { logger } = require("../utils/logger");

// Get course list service
const courseList = async (traceId, response) => {
    try {
        // Get course list query
        let getCourse = await getCourseList()
        logger.debug(`service.courseList Course count: ${getCourse.length}`)

        if (getCourse && getCourse.length > 0) {
            logger.info("Get course list successfully", traceId)
            responseHandler(response, 200, { data: { courses: getCourse } }, null);
        } else {
            logger.info("Get course list successfully", traceId)
            responseHandler(response, 200, { data: {} }, null);
        }
    } catch (error) {
        // exception block
        logger.error("service.courseList() Error: error in courseList service", traceId)
        responseHandler(response, 500, null, {
            message: "Internal server error",
        });
    }
};

const courseEnroll = async ({ courseId, present, userId, traceId }, response) => {
    try {
        // find course by courseId query
        let getCourse = await getCourseByCourseId(courseId);

        if (getCourse && getCourse.length > 0) {
            await updateAttendance(present, userId, courseId);
            logger.info("Course enroll success", traceId)
            responseHandler(response, 200, { message: "success" }, null);
        } else {
            // If course not found
            logger.error("service.courseEnroll() Error: course not found", traceId)
            responseHandler(response, 404, null, { message: "course not found" });
        }
    } catch (error) {
        // exception block
        logger.error("service.courseEnroll() Error: error in courseEnroll service", traceId)
        responseHandler(response, 500, null, {
            message: "Internal server error",
        });
    }
}

const courseUnderstanding = async ({ courseId, understanding, userId, traceId }, response) => {
    try {
        // Find course by courseId query
        let getCourse = await getCourseByCourseId(courseId);

        if (getCourse && getCourse.length > 0) {
            // Prepare query for get response
            let getResponseData = getResponseByCourseAndUser(courseId, userId);
            logger.debug(`service.courseUnderstanding()  getResponseByCourseAndUser count: ${getResponseData.length}`)
            if (getResponseData && getResponseData.length > 0) {
                // Prepare query for update course understanding
                await updateUnderstandingRecord(understanding, userId, courseId);
                logger.info("Course understanding success", traceId)
                responseHandler(response, 200, { message: "success" }, null);
            } else {
                let responseId = v4();
                // Prepare query for understanding response
                await createUnderstandingResponse(responseId, understanding, courseId, userId);
                logger.info("Course understanding success", traceId)
                responseHandler(response, 200, { message: "success" }, null);
            }
        } else {
            // If course not found
            logger.error("service.courseUnderstanding() Error: course not found", traceId)
            responseHandler(response, 404, null, { message: "course not found" });
        }
    } catch (error) {
        // exception block
        logger.error("service.courseUnderstanding() Error: error in courseUnderstanding service", traceId)
        responseHandler(response, 500, null, {
            message: "Internal server error",
        });
    }
}

const questionsList = async ({ courseId, traceId }, response) => {
    try {
        // Prepare query for find course by courseId
        let getCourse = await getCourseByCourseId(courseId);

        if (getCourse && getCourse.length > 0) {
            // Prepare query for question list by courseId
            let questionList = await getQuestionsByCourseId(courseId);
            logger.info("Question list successfully", traceId)
            responseHandler(response, 200, { data: { questions: questionList } }, null);
        } else {
            responseHandler(response, 200, { data: {}, }, null);
        }
    } catch (error) {
        // exception block
        logger.error("service.questionsList() Error: error in questionsList service", traceId)
        responseHandler(response, 500, null, {
            message: "Internal server error",
        });
    }
}

const addAnswer = async ({ courseId, userId, questionId, answer, traceId }, response) => {
    try {
        // Prepare query for find course by courseId
        let getCourse = await getCourseByCourseId(courseId);

        if (getCourse && getCourse.length > 0) {
            // Prepare query for get answer by course and user
            let findAnswerData = await getAnswerByCourseAndUserId(courseId, questionId, userId);

            logger.debug(`service.addAnswer() Find answer count: ${findAnswerData.length}`)
            if (findAnswerData && findAnswerData.length > 0) {
                let previousAnswer = findAnswerData[0].answer;
                let answerArray = [];
                answerArray.push(...previousAnswer, answer);

                // Prepare query for update answer
                await updateAnswerRecord(answerArray, courseId, questionId, userId);

                logger.info("Answer add success", traceId)
                responseHandler(response, 200, { message: "success" }, null);
            } else {
                // If answer not found
                let queId = v4();

                // Prepare query for add answer
                await addAnswerData(queId, questionId, answer, courseId, userId);

                logger.info("Add answer success", traceId)
                responseHandler(response, 200, { message: "success" }, null);
            }
        } else {
            // If course not found
            logger.error("service.courseUnderstanding() Error: course not found", traceId)
            responseHandler(response, 404, null, { message: "course not found" });
        }
    } catch (error) {
        // exception block
        logger.error("service.addAnswer() Error: error in addAnswer service", traceId)
        responseHandler(response, 500, null, {
            message: "Internal server error",
        });
    }
}

const updateAnswerOfGroup = async ({ courseId, groupId, questionId, answer, traceId }, response) => {
    let groId = v4();
    try {
        // Prepare query for get group by groupId 
        let getGroupData = await getGroupByGroupId(groupId);

        if (!getGroupData[0]) {
            // If group not found
            logger.error(`service.updateAnswerOfGroup() Error: group not found`, traceId)
            return responseHandler(response, 404, null, { message: "group not found" });
        }

        // Prepare query for get course by courseId
        let getCourse = await getCourseByCourseId(courseId);

        if (getCourse && getCourse.length > 0) {
            // Prepare query for get response by group and course
            let findDataQuery = await getResponseByGroupIdAndCourseId(courseId, groupId, questionId);

            logger.debug(`service.updateAnswerOfGroup() Get ResponseByGroupIdAndCourseId count: ${findDataQuery.length}`)
            if (findDataQuery && findDataQuery.length > 0) {
                // Prepare query for update answer of group response
                await updateAnswerOfGroupResponse(answer, courseId, groupId, questionId);

                logger.info("Update answer of group", traceId)
                responseHandler(response, 200, { message: "success" }, null);
            } else {
                // If response not found

                // Prepare query for add group response answer
                await addAnswerGroupResponse(groId, answer, questionId, courseId, groupId);

                logger.info("Add answer of group Success", traceId)
                responseHandler(response, 200, { message: "success" }, null);
            }
        } else {
            // If course not found
            logger.error("service.updateAnswerOfGroup() Error: course not found", traceId)
            responseHandler(response, 404, null, { message: "course not found" });
        }
    } catch (error) {
        // exception block
        logger.error("service.updateAnswerOfGroup() Error: error in updateAnswerOfGroup service", traceId)
        responseHandler(response, 500, null, {
            message: "Internal server error",
        });
    }
}


const createGroupOfStudent = async ({ courseId, count, traceId }, response) => {
    try {
        // Prepare query for get course by courseId 
        let getCourse = await getCourseByCourseId(courseId);
        if (getCourse && getCourse.length > 0) {
            // Prepare query for enrolment data by present student
            let findDataQuery = await getEnrolmentDataByPresentStudent(courseId);

            if (findDataQuery && findDataQuery.length > 0) {
                // prepare query for delete group
                await deleteGroupByCourseId(courseId);
                let userArray = [];
                await findDataQuery.map((data) => {
                    userArray.push(data.user_id)
                });
                const n = 5;
                // Create user array
                const createUserArray = new Array(Math.ceil(userArray.length / n)).fill().map((_) => userArray.splice(0, n));
                logger.debug(`service.createGroupOfStudent() Create user array count: ${createUserArray.length}`, traceId)

                if (!count) {
                    for (let i = 0; i < createUserArray.length; i++) {
                        let groId = v4();
                        let groupName = 'group' + (i + 1);
                        // Prepare query for create group
                        await createGroup(groId, groupName, courseId, createUserArray[i]);
                    }

                    // Prepare query for get group by course
                    let getGroup = await getGroupByCourseId(courseId);
                    logger.debug(`service.createGroupOfStudent() Create group count: ${getGroup.length}`, traceId)

                    logger.info("Create group of data without count in req.query", traceId)
                    responseHandler(response, 200, { data: { groups: getGroup } }, null);
                } else {
                    let userArrayData;

                    if (count <= createUserArray.length) userArrayData = count
                    else userArrayData = createUserArray

                    for (let i = 0; i < userArrayData.length; i++) {
                        let groId = v4();
                        let groupName = 'group' + (i + 1);
                        // Prepare query for create group
                        await createGroup(groId, groupName, courseId, userArrayData[i]);
                    }

                    // Prepare query for get group by course
                    let getGroup = await getGroupByCourseId(courseId);
                    logger.debug(`service.createGroupOfStudent() Create group by course count: ${getGroup.length}`, traceId)

                    logger.info("Create group of data with count in req.query", traceId)
                    responseHandler(response, 200, { data: { groups: getGroup } }, null);
                }
            } else {
                // If student enrolment data not found
                logger.error("service.createGroupOfStudent() Error: student enrollment data not found", traceId)
                responseHandler(response, 404, null, { message: "student enrollment data not found" });
            }
        } else {
            // If course not found
            logger.error("service.createGroupOfStudent() Error: course not found", traceId)
            responseHandler(response, 404, null, { message: "course not found" });
        }
    } catch (error) {
        // exception block
        logger.error("service.createGroupOfStudent() Error: error in createGroupOfStudent service", traceId)
        responseHandler(response, 500, null, {
            message: "Internal server error",
        });
    }
}

const getAnswerOfGroup = async ({ courseId, traceId }, response) => {
    try {
        // Prepare query for get course by courseId
        let getCourse = await getCourseByCourseId(courseId);

        if (getCourse && getCourse.length > 0) {
            // Prepare query for group response list
            let groupResponseData = await getGroupResponseList();
            logger.debug(`service.getAnswerOfGroup() Group response data count: ${groupResponseData.length}`, traceId)

            if (groupResponseData && groupResponseData.length > 0) {
                logger.info("Get answer of group data", traceId)
                responseHandler(response, 200, { data: { groups: groupResponseData } }, null);
            } else {
                logger.info("Get answer of group data if Group response data count is 0", traceId)
                responseHandler(response, 200, { data: {}, }, null);
            }
        } else {
            // If course not found
            logger.error("service.getAnswerOfGroup() Error: course not found", traceId)
            responseHandler(response, 404, null, { message: "course not found" });
        }
    } catch (error) {
        // exception block
        logger.error("service.getAnswerOfGroup() Error: error in getAnswerOfGroup service", traceId)
        responseHandler(response, 500, null, {
            message: "Internal server error",
        });
    }
};

const wordCloudList = async ({ courseId, userId, traceId }, response) => {
    try {
        // Prepare query for get course by courseId
        let getCourse = await getCourseByCourseId(courseId);

        if (getCourse && getCourse.length > 0) {
            // Prepare query for get strike word
            let getStrikeWordData = await getStrikeWord(courseId);
            let word = getStrikeWordData[0].strike_word;
            let wordObject = {
                userId,
                "word": word
            }
            logger.info("Get word cloud list", traceId)
            responseHandler(response, 200, { data: { wordCloud: wordObject } }, null);
        } else {
            responseHandler(response, 200, { data: {}, }, null);
        }
    } catch (error) {
        // exception block
        logger.error("service.wordCloudList() Error: error in wordCloudList service", traceId)
        responseHandler(response, 500, null, {
            message: "Internal server error",
        });
    }
}

const reportsList = async ({ courseId, userId, traceId }, response) => {
    try {
        // Prepare query for get course by courseId
        let getCourse = await getCourseByCourseId(courseId);
        if (getCourse && getCourse.length > 0) {

            //Prepare query for group response list
            let groupRows = await getGroupResponseListByCourseId(courseId);

            //Prepare query for response
            getResponseByCourse = await getResponseByCourseId(courseId);
            let getResponse = [];

            //for questionid and answer from answers table
            for (let i = 0; i < getResponseByCourse.length; i++) {
                // Prepare query for answer by course and user
                let questionUserData = await getAnswerByCourseIdAndUserId(getResponseByCourse[i].userId, courseId);
                getResponse.push({
                    userId: getResponseByCourse[i]?.userId,
                    strikeWord: getResponseByCourse[i]?.strikeWord,
                    understanding: getResponseByCourse[i]?.understanding,
                    response: questionUserData
                })
            }
            logger.info("reports list", traceId)
            responseHandler(response, 200, { data: { groups: groupRows, users: getResponse } }, null);
        } else {
            responseHandler(response, 200, { data: {}, }, null);
        }
    } catch (error) {
        // exception block
        logger.error("service.reportsList() Error: error in reportsList service", traceId)
        responseHandler(response, 500, null, {
            message: "Internal server error",
        });
    }
}

module.exports = {
    courseList,
    courseEnroll,
    courseUnderstanding,
    questionsList,
    addAnswer,
    updateAnswerOfGroup,
    createGroupOfStudent,
    getAnswerOfGroup,
    wordCloudList,
    reportsList
};

