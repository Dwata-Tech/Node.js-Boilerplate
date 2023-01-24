require("dotenv").config();
const razorpaySdk = require("razorpay");
const moment = require("moment")

const { responseHandler } = require("../utils/responseHandler");
const { createSubscriptionData } = require("../data/subscription_dao");
const { logger } = require("../utils/logger");

// instanciate SDK
var razorPayInstance = new razorpaySdk({
  key_id: process.env.RAZOR_PAY_KEY_ID,
  key_secret: process.env.RAZOR_PAY_KEY_SECRET,
});

// subscription duration
const DURATION = {
  MONTHLY: "monthly",
  WEEKLY: "weekly",
  YEARLY: "yearly",
  DAILY: "daily",
};

const listPlans = async (traceId, response) => {
  try {
    let plans = await razorPayInstance.plans.all();
    let { items } = plans;

    // razor pay response mapping
    let finalResponseArray = [];

    // loop through plan items and map individual fields
    for (let plan of items) {
      let { id, period, interval, item } = plan;
      let { currency, amount, name } = item;
      calculatedInterval = calculatePlanInterval(interval, period);
      amount = amount.toString().slice(0, -2);
      finalResponseArray.push({
        id,
        name,
        interval: calculatedInterval + " days",
        currency,
        price: parseInt(amount).toFixed(2),
      });
    }
    logger.info("Get list of plans data", traceId)
    responseHandler(
      response,
      200,
      { data: { plans: finalResponseArray } },
      null
    );
  } catch (error) {
    // exception block
    logger.error("service.listPlans() Error: error in listPlans service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
};

const getPlanDetails = async ({ id, traceId }, response) => {
  try {
    let planId = id;
    let plan = await razorPayInstance.plans.fetch(planId);
    if (plan) {
      let { id, period, interval, item } = plan;
      let { currency, amount, name } = item;
      calculatedInterval = calculatePlanInterval(interval, period);
      amount = amount.toString().slice(0, -2);

      logger.info("Get plan details success", traceId)
      responseHandler(
        response,
        200,
        {
          data: {
            id,
            name,
            interval: calculatedInterval + " days",
            currency,
            price: parseInt(amount).toFixed(2),
          },
        },
        null
      );
    } else {
      logger.error("service.getPlanDetails() Error: Plan not found")
      responseHandler(response, 404, null, {
        message: "Plan not found",
      });
    }
  } catch (error) {
    // exception block
    logger.error("service.getPlanDetails() Error: error in getPlanDetails service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
};

const createSubscription = async ({ userId, planId, traceId }, response) => {
  try {

    let createSubscriptionPayload = {
      plan_id: planId,
      total_count: process.env.SUBSCRIPTION_TOTAL_COUNT,
      quantity: process.env.SUBSCRIPTION_UNIT_COUNT,
      notes: {
        userId,
      },
    };
    let razorPayResponse = await razorPayInstance.subscriptions.create(
      createSubscriptionPayload
    );

    // extract variable
    let { id } = razorPayResponse

    // create db query
    await createSubscriptionData(userId, id);

    logger.info("Create subscription success", traceId)
    responseHandler(response, 200, { message: "success" }, null);
  } catch (error) {
    // exception block
    logger.error("service.createSubscription() Error: error in createSubscription service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
};

const fetchSubscriptionDetails = async ({ subscriptionId, traceId }, response) => {
  try {

    // fetch susbcription detials
    let subscriptionDetails = await razorPayInstance.subscriptions.fetch(subscriptionId)

    let { id, plan_id, notes, short_url, status, current_start, current_end } = subscriptionDetails

    // fetch plan details
    let planDetails = await razorPayInstance.plans.fetch(plan_id)

    let { item } = planDetails

    let { name } = item

    // create subscription details
    let susbscriptionDetails = {
      subscriptionId: id,
      planId: plan_id,
      planName: name,
      userId: notes.userId,
      paymentLink: short_url,
      status,
      startDate: moment(current_start).format("DD-MMM-YYYY hh:mm:ss"),
      endDate: moment(current_end).format("DD-MMM-YYYY hh:mm:ss"),
    }
    logger.info("Fetch subscription success", traceId)
    responseHandler(response, 200, { data: susbscriptionDetails }, null);
  } catch (error) {
    // exception block
    logger.error("service.fetchSubscriptionDetails() Error: error in fetchSubscriptionDetails service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
}

const cancelSubscription = async (subscriptionId, cancelAtEndOfBillingCycle, traceId, response) => {
  try {
    await razorPayInstance.subscriptions.cancel(subscriptionId, cancelAtEndOfBillingCycle)
    logger.info("Cancel subscription success", traceId)
    responseHandler(response, 200, { message: "Success" }, null);
  } catch (error) {
    // exception block
    logger.error("service.cancelSubscription() Error: error in cancelSubscription service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
}

//   calculate plan duration in days
function calculatePlanInterval(interval, period) {
  switch (period) {
    case DURATION.DAILY:
      return 1 * interval;
    case DURATION.WEEKLY:
      return 7 * interval;
    case DURATION.MONTHLY:
      return 30 * interval;
    case DURATION.YEARLY:
      return 365 * interval;
    default:
      return 0;
  }
}

module.exports = {
  listPlans,
  getPlanDetails,
  createSubscription,
  fetchSubscriptionDetails,
  cancelSubscription
};
