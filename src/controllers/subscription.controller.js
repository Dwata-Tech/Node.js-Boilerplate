const { logger, validateHeaders } = require("../utils/logger");
const { responseHandler } = require("../utils/responseHandler");
const service = require("./../services");

// Get plan list controller
const listPlansController = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error("controller.listPlansController() Error: x-request-id  is missing in header")
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];

  service.listPlans(traceId, response);
};

// Get plan details controller
const planDetailsController = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error("controller.planDetailsController() Error: x-request-id  is missing in header")
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];

  // validate plan Id
  let { id = 0 } = request.params;
  // validate plan id
  if (!id || !id.toString().trim()) {
    logger.error("controller.planDetailsController() Error: id is missing", traceId)
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  service.getPlanDetails({ id, traceId }, response);
};

// Create subscription controller
const createSubscriptionController = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error("controller.createSubscriptionController() Error: x-request-id  is missing in header")
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];


  // validate plan Id
  let { planId = 0 } = request.body;
  // validate plan id
  if (!planId || !planId.toString().trim()) {
    logger.error("controller.createSubscriptionController() Error: plainId is missing", traceId)
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  let userId = request.user.user_id;
  service.createSubscription({ userId, planId, traceId }, response);
};

// Get subscription details controller
const fetchSubscriptionDetailsController = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error("controller.fetchSubscriptionDetailsController() Error: x-request-id  is missing in header")
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];


  let { subscriptionId = 0 } = request.params;
  if (!subscriptionId || !subscriptionId.toString().trim()) {
    logger.error("controller.fetchSubscriptionDetailsController() Error: subscriptionId is missing", traceId)
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  service.fetchSubscriptionDetails({ subscriptionId, traceId }, response);
};

// Cancel subscription controller
const cancelSubscriptionController = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error("controller.cancelSubscriptionController() Error: x-request-id  is missing in header")
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];


  let { subscriptionId = 0 } = request.params;
  let { cancelAtEndOfBillingCycle = false } = request.body
  if (!subscriptionId || !subscriptionId.toString().trim() || typeof cancelAtEndOfBillingCycle != "boolean") {
    logger.error("controller.cancelSubscriptionController() Error: subscriptionId missing and cancelAtEndOfBillingCycle is missing or not boolean", traceId)
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  service.cancelSubscription(subscriptionId, cancelAtEndOfBillingCycle, traceId, response);
};
module.exports = {
  listPlansController,
  planDetailsController,
  createSubscriptionController,
  fetchSubscriptionDetailsController,
  cancelSubscriptionController
};
