const { responseHandler } = require("./../utils/responseHandler");
const services = require("./../services");
const { VERIFY_EMAIL, VERIFY_PHONE } = require("./../data/dbConstants");
const { logger, validateHeaders } = require("../utils/logger");

// User login controller
const loginController = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error(
      "controller.loginController() Error: x-request-id  is missing in header"
    );
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  // get traceId
  let traceId = request.headers["x-request-id"];
  let { email, password } = request.body;

  // validate email and password
  if (!email || !password) {
    logger.error(
      "controller.loginController() Error: email or password missing",
      traceId
    );
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  services.login({ email, password, traceId }, response);
};

// User register controller
const registerController = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error(
      "controller.registerController() Error: x-request-id  is missing in header"
    );
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];
  let { email, password, firstName, lastName, phoneNumber, loginType } =
    request.body;

  // validate email, password, firstName, lastName, phoneNumber and loginType
  if (
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !loginType
  ) {
    logger.error(
      "controller.registerController() Error: missing required fields",
      traceId
    );
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  services.register(
    { email, password, firstName, lastName, phoneNumber, loginType, traceId },
    response
  );
};

// Send OTP controller
const sendOTP = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error(
      "controller.sendOTP() Error: x-request-id  is missing in header"
    );
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];
  let { type } = request.body;

  // validate type like VERIFY_EMAIL or VERIFY_PHONE
  if (!type || ![VERIFY_EMAIL, VERIFY_PHONE].includes(type)) {
    logger.error("controller.sendOTP() Error: Missing type field", traceId);
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  let userId = request.user.user_id;
  services.sendOTP({ userId, type, user: request.user, traceId }, response);
};

// Verify controller
const verifyOTP = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error(
      "controller.verifyOTP() Error: x-request-id  is missing in header"
    );
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];
  let { otp, type } = request.body;

  // validate otp and type
  if (!otp || !type || ![VERIFY_EMAIL, VERIFY_PHONE].includes(type)) {
    logger.error("controller.verifyOTP() Error: OTP or type missing", traceId);
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  let userId = request.user.user_id;
  services.verifyOTP({ incomingOTP: otp, userId, type, traceId }, response);
};

// Logout controller
const logoutController = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error(
      "controller.logoutController() Error: x-request-id  is missing in header"
    );
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];

  let sessionId = request.user.sessionId;
  services.logoutUser({ sessionId, traceId }, response);
};

// Register user using google controller
const registerUserUsingGoogle = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error(
      "controller.registerUserUsingGoogle() Error: x-request-id  is missing in header"
    );
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];
  // validate accessToken
  const { accessToken } = request.body;
  if (!accessToken) {
    logger.error(
      "controller.registerUserUsingGoogle() Error: accessToken missing",
      traceId
    );
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  services.registerUserUsingGoogle(accessToken, "GOOGLE", traceId, response);
};

// Register user using linkedin controller
const registerUserUsingLinkedIn = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error(
      "controller.registerUserUsingLinkedIn() Error: x-request-id  is missing in header"
    );
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];

  const { accessToken } = request.body;
  // validate accessToken
  if (!accessToken || !accessToken.toString().trim()) {
    logger.error(
      "controller.registerUserUsingLinkedIn() Error: accessToken missing",
      traceId
    );
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  services.registerUserUsingLinkedIn(
    accessToken,
    "LINKEDIN",
    traceId,
    response
  );
};

// Register user using facebook controller
const registerUserUsingFacebook = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error(
      "controller.registerUserUsingFacebook() Error: x-request-id  is missing in header"
    );
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];

  const { accessToken } = request.body;
  // validate accessToken
  if (!accessToken || !accessToken.toString().trim()) {
    logger.error(
      "controller.registerUserUsingFacebook() Error: accessToken missing",
      traceId
    );
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  services.registerUserUsingFacebook(
    accessToken,
    "FACEBOOK",
    traceId,
    response
  );
};

// Forgot password controller
const forgotPasswordController = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error(
      "controller.forgotPasswordController() Error: x-request-id  is missing in header"
    );
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];

  const { email } = request.body;
  // validate email
  if (!email) {
    logger.error(
      "controller.forgotPasswordController() Error: Email is missing",
      traceId
    );
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  services.forgotPassword({ email, traceId }, response);
};

// Change password controller
const changePasswordController = (request, response) => {
  // validate x-request-id in header
  if (!validateHeaders(request)) {
    logger.error(
      "controller.changePasswordController() Error: x-request-id  is missing in header"
    );
    responseHandler(response, 400, null, {
      message: "x-request-id  is missing in header",
    });
    return;
  }
  let traceId = request.headers["x-request-id"];

  const { email, password, otp } = request.body;
  // validate email password and otp
  if (!email || !password || !otp) {
    logger.error(
      "controller.changePasswordController() Error: Email, password or otp missing",
      traceId
    );
    responseHandler(response, 400, null, {
      message: "Please provide valid data",
    });
    return;
  }
  services.changePassword({ email, password, otp, traceId }, response);
};

module.exports = {
  loginController,
  registerController,
  verifyOTP,
  sendOTP,
  logoutController,
  registerUserUsingGoogle,
  registerUserUsingLinkedIn,
  registerUserUsingFacebook,
  forgotPasswordController,
  changePasswordController,
};
