const { logger, validateHeaders } = require("../utils/logger");
const { responseHandler } = require("../utils/responseHandler");
const service = require("./../services");

// Get course List controller
const courseListController = (request, response) => {
    // validate x-request-id in header
    if (!validateHeaders(request)) {
        logger.error("controller.courseListController() Error: x-request-id  is missing in header")
        responseHandler(response, 400, null, {
            message: "x-request-id  is missing in header",
        });
        return;
    }
    let traceId = request.headers["x-request-id"];
    service.courseList(traceId, response);
};

// Student enroll course controller
const studentEnrollCourse = (request, response) => {
    // validate x-request-id in header
    if (!validateHeaders(request)) {
        logger.error("controller.studentEnrollCourse() Error: x-request-id  is missing in header")
        responseHandler(response, 400, null, {
            message: "x-request-id  is missing in header",
        });
        return;
    }
    let traceId = request.headers["x-request-id"];

    let { courseId } = request.params;
    let { present } = request.query;

    // validate courseId and present
    if (!courseId || !present) {
        logger.error("controller.studentEnrollCourse() Error: courseId or present missing", traceId)
        responseHandler(response, 400, null, {
            message: "Please provide valid data",
        });
        return;
    }
    let userId = request.user.user_id
    service.courseEnroll({ courseId, present, userId, traceId }, response);
};

// Student understanding course controller
const studentUnderstandingCourse = (request, response) => {
    // validate x-request-id in header
    if (!validateHeaders(request)) {
        logger.error("controller.studentUnderstandingCourse() Error: x-request-id  is missing in header")
        responseHandler(response, 400, null, {
            message: "x-request-id  is missing in header",
        });
        return;
    }
    let traceId = request.headers["x-request-id"];

    let { courseId } = request.params;
    let { understanding } = request.body;

    // validate courseId and understanding
    if (!courseId || !understanding) {
        logger.error("controller.studentUnderstandingCourse() Error: courseId or understanding missing", traceId)
        responseHandler(response, 400, null, {
            message: "Please provide valid data",
        });
        return;
    }
    let userId = request.user.user_id
    service.courseUnderstanding({ courseId, understanding, userId, traceId }, response);
};

// Get question list controller
const questionsListController = (request, response) => {
    // validate x-request-id in header
    if (!validateHeaders(request)) {
        logger.error("controller.questionsListController() Error: x-request-id  is missing in header")
        responseHandler(response, 400, null, {
            message: "x-request-id  is missing in header",
        });
        return;
    }
    let traceId = request.headers["x-request-id"];

    let { courseId } = request.params;

    // validate courseId
    if (!courseId) {
        logger.error("controller.questionsListController() Error: courseId missing", traceId)
        responseHandler(response, 400, null, {
            message: "Please provide valid input",
        });
        return;
    }

    service.questionsList({ courseId, traceId }, response);
};

// Add answer controller
const addAnswerController = (request, response) => {
    // validate x-request-id in header
    if (!validateHeaders(request)) {
        logger.error("controller.addAnswerController() Error: x-request-id  is missing in header")
        responseHandler(response, 400, null, {
            message: "x-request-id  is missing in header",
        });
        return;
    }
    let traceId = request.headers["x-request-id"];

    let { courseId } = request.params;
    let { answer, questionId } = request.body;

    // validate courseId answer and questionId
    if (!courseId || !answer || !questionId) {
        logger.error("controller.addAnswerController() Error: courseId or answer or questionId missing", traceId)
        responseHandler(response, 400, null, {
            message: "Please provide valid input",
        });
        return;
    }
    let userId = request.user.user_id
    service.addAnswer({ courseId, userId, questionId, answer, traceId }, response);
};

// Update answer of group controller
const updateAnswerOfGroupController = (request, response) => {
    // validate x-request-id in header
    if (!validateHeaders(request)) {
        logger.error("controller.updateAnswerOfGroupController() Error: x-request-id  is missing in header")
        responseHandler(response, 400, null, {
            message: "x-request-id  is missing in header",
        });
        return;
    }
    let traceId = request.headers["x-request-id"];

    let { courseId, groupId } = request.params;
    let { answer, questionId } = request.body;

    // validate courseId groupId answer and questionId
    if (!courseId || !groupId || !answer || !questionId) {
        logger.error("controller.updateAnswerOfGroupController() Error: courseId or groupId or answer or questionId missing", traceId)
        responseHandler(response, 400, null, {
            message: "Please provide valid input",
        });
        return;
    }
    service.updateAnswerOfGroup({ courseId, groupId, questionId, answer, traceId }, response);
};

// create group controller
const createGroupController = (request, response) => {
    // validate x-request-id in header
    if (!validateHeaders(request)) {
        logger.error("controller.createGroupController() Error: x-request-id  is missing in header")
        responseHandler(response, 400, null, {
            message: "x-request-id  is missing in header",
        });
        return;
    }
    let traceId = request.headers["x-request-id"];

    let { courseId } = request.params;
    let { count } = request.query;

    // validate courseId
    if (!courseId) {
        logger.error("controller.createGroupController() Error: courseId is missing", traceId)
        responseHandler(response, 400, null, {
            message: "Please provide valid input",
        });
        return;
    }
    service.createGroupOfStudent({ courseId, count, traceId }, response);
};

// Group answer controller
const groupAnswerController = (request, response) => {
    // validate x-request-id in header
    if (!validateHeaders(request)) {
        logger.error("controller.groupAnswerController() Error: x-request-id  is missing in header")
        responseHandler(response, 400, null, {
            message: "x-request-id  is missing in header",
        });
        return;
    }
    let traceId = request.headers["x-request-id"];

    let { courseId } = request.params;

    // validate courseId
    if (!courseId) {
        logger.error("controller.groupAnswerController() Error: courseId is missing", traceId)
        responseHandler(response, 400, null, {
            message: "Please provide valid input",
        });
        return;
    }
    service.getAnswerOfGroup({ courseId, traceId }, response);
};

// Word cloud list controller
const wordCloudListController = (request, response) => {
    // validate x-request-id in header
    if (!validateHeaders(request)) {
        logger.error("controller.wordCloudListController() Error: x-request-id  is missing in header")
        responseHandler(response, 400, null, {
            message: "x-request-id  is missing in header",
        });
        return;
    }
    let traceId = request.headers["x-request-id"];

    let { courseId } = request.params;
    let userId = request.user.user_id;

    // validate courseId
    if (!courseId) {
        logger.error("controller.wordCloudListController() Error: courseId is missing", traceId)
        responseHandler(response, 400, null, {
            message: "Please provide valid input",
        });
        return;
    }

    service.wordCloudList({ courseId, userId, traceId }, response);
};

// Get report list controller
const reportsListController = (request, response) => {
    // validate x-request-id in header
    if (!validateHeaders(request)) {
        logger.error("controller.reportsListController() Error: x-request-id  is missing in header")
        responseHandler(response, 400, null, {
            message: "x-request-id  is missing in header",
        });
        return;
    }
    let traceId = request.headers["x-request-id"];

    let { courseId } = request.params;
    let userId = request.user.user_id;

    // validate courseId
    if (!courseId) {
        logger.error("controller.reportsListController() Error: courseId is missing", traceId)
        responseHandler(response, 400, null, {
            message: "Please provide valid input",
        });
        return;
    }

    service.reportsList({ courseId, userId, traceId }, response);
};


module.exports = {
    courseListController,
    studentEnrollCourse,
    studentUnderstandingCourse,
    questionsListController,
    addAnswerController,
    updateAnswerOfGroupController,
    createGroupController,
    groupAnswerController,
    wordCloudListController,
    reportsListController
};
