const { responseHandler } = require("./../utils/responseHandler");

const services = require("./../services");
const { logger, validateHeaders } = require("../utils/logger");

// Get user details by id controller
const findUserById = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error("controller.findUserById() Error: x-request-id  is missing in header")
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];

  let { userId } = request.params;
  // validate userId
  if (!userId) {
    logger.error("controller.findUserById() Error: userId is missing", traceId)
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  services.findUserById({ userId, traceId }, response);
};

// Get user by email controller
const findUserByEmail = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error("controller.findUserByEmail() Error: x-request-id  is missing in header")
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];

  let { email } = request.params;
  // validate email
  if (!email) {
    logger.error("controller.findUserByEmail() Error: email is missing", traceId)
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  services.findUserByEmail({ email, traceId }, response);
};

// updateUserStatus by using id controller
const updateUserStatus = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error("controller.updateUserStatus() Error: x-request-id  is missing in header")
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];

  let { status } = request.body;
  // validate status
  if (!status) {
    logger.error("controller.updateUserStatus() Error: status is missing", traceId)
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }

  if (status === "ACTIVE") {
    status = true;
  } else {
    status = false;
  }
  let userId = request.user.user_id;
  services.updateUserStatus({ status, userId, traceId }, response);
};

// update user details controller
const updateUserDetails = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error("controller.updateUserDetails() Error: x-request-id  is missing in header")
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];

  let { id, firstName, lastName, email, phoneNumber } = request.body;

  // validate id
  if (!id) {
    logger.error("controller.updateUserDetails() Error: id is missing", traceId)
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }

  //   check which values needs to be updated
  let valuesToBeUpdated = { id };

  if (firstName) {
    valuesToBeUpdated = { ...valuesToBeUpdated, firstName };
  }
  if (lastName) {
    valuesToBeUpdated = { ...valuesToBeUpdated, lastName };
  }
  if (email) {
    valuesToBeUpdated = { ...valuesToBeUpdated, email };
  }
  if (phoneNumber) {
    valuesToBeUpdated = { ...valuesToBeUpdated, phoneNumber };
  }

  if (valuesToBeUpdated && Object.keys(valuesToBeUpdated).length == 0) {
    logger.error("controller.updateUserDetails() Error: valuesToBeUpdated length is equal to 0", traceId)
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }

  services.updateUserDetails(
    { ...valuesToBeUpdated, traceId },
    response
  );
};

module.exports = {
  findUserById,
  findUserByEmail,
  updateUserStatus,
  updateUserDetails
};
