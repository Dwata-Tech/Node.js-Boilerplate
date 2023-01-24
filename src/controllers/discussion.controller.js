const { responseHandler } = require("./../utils/responseHandler");

const services = require("./../services");
const { logger, validateHeaders } = require("../utils/logger");

// Add discussion controller
const addDiscussionController = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error("controller.addDiscussionController() Error: x-request-id  is missing in header")
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];

  const userId = request.user.user_id;
  let { courseId } = request.params;
  let { question } = request.body;

  // validate question and courseId
  if (!question || !courseId) {
    logger.error("controller.addDiscussionController() Error: courseId or question missing", traceId)
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  services.addDiscussion({ userId, question, courseId, traceId }, response);
};

// Get discussion items controller
const getDiscussionItemsController = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error("controller.getDiscussionItemsController() Error: x-request-id  is missing in header")
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];
  let { courseId } = request.params;

  // validate courseId
  if (!courseId) {
    logger.error("controller.getDiscussionItemsController() Error: courseId is missing", traceId)
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  services.getDiscussionItems({ courseId, traceId }, response);
};

// Update discussion items controller 
const updateDiscussionItemsController = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error("controller.updateDiscussionItemsController() Error: x-request-id  is missing in header")
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];

  let { id, answer } = request.body;
  let { courseId } = request.params;
  const userId = request.user.user_id;

  // validate courseId id and answer
  if (!id || !answer || !courseId) {
    logger.error("controller.updateDiscussionItemsController() Error: id or answer or courseId missing", traceId)
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  services.updateDiscussionItems({ id, answer, courseId, userId, traceId }, response);
};
module.exports = {
  addDiscussionController,
  getDiscussionItemsController,
  updateDiscussionItemsController,
};
