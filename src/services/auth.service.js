// librart imports
const { v4 } = require("uuid");
const moment = require("moment");

// custom imports
const { responseHandler } = require("./../utils/responseHandler");
const { generateJWT } = require("./../utils/generateJWT");
const { query } = require("./../data/connect");
const {
  USER_ID,
  VERIFY_EMAIL,
  VERIFY_PHONE,
} = require("./../data/dbConstants");
const { googleAPICall } = require("../utils/apiCallGoogleDecodeToken");
const { linkedInApiCall } = require("../utils/apiCallLinkedInDecodeToken");
const { facebookAPICall } = require("../utils/apiCallFacebookDecodeToken");
const { sendMobileOTP } = require("../utils/sendOTP");
const { sendEmailOTP } = require("../utils/sendMail");
const forgotPasswordEmail = "email_templates/forgotPassword.txt";
const fs = require('fs');
const { checkLoginDetails, createUserLogin, createUserSocialLogin, findEmail, getUserEmailData, updatePassword } = require("./../data/user_login_dao");
const { createSession, getSessionData, updateSessionData } = require("./../data/session_dao");
const { registerUser, socialLogin } = require("./../data/user_dao");
const { getOtpData, updateOtpRecord, invalidateOtpOfSameType, generateOtp, getOtpDataForChangePassword } = require("./../data/otp_history_dao");
const { logger } = require("../utils/logger");

// Login service
async function login({ email, password, traceId }, response) {
  try {
    // prepare query
    let checkUserLogin = await checkLoginDetails(email, password);

    // if user found
    if (checkUserLogin && checkUserLogin.length == 1) {
      let foundUser = checkUserLogin[0];

      // generate unique session ID
      let sessionId = v4();

      // generate session expiry -> currently 7D
      let session_expiry = moment()
        .add(process.env.SESSION_EXPIRY_IN_DAYS, "days")
        .toISOString();

      logger.debug(`service.login() Session expire date: ${session_expiry}`, traceId)

      // Create session query
      await createSession(sessionId, foundUser[USER_ID], session_expiry, "EMAIL_PASSWORD");
      // generate JWT
      let token = generateJWT({
        userId: foundUser[USER_ID],
        sessionId,
      });
      logger.info(`Login successfully UserId: ${foundUser[USER_ID]}`, traceId)
      responseHandler(response, 200, { data: { token } }, null);
    } else {
      // if user not found
      logger.error(`service.login() Email/Password does not match`, traceId)
      responseHandler(response, 401, null, {
        message: "Email/Password does not match",
      });
    }
  } catch (error) {
    // exception block
    logger.error("service.login() Error: error in loginService")
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
};

// Register service
async function register(
  { email, password, firstName, lastName, phoneNumber, loginType, traceId },
  response
) {
  try {
    let isEmailAvailable = await checkIfEmailIsAvailable(email);

    if (!isEmailAvailable) {
      logger.error(`service.register() Error: ${email} this email is already taken`, traceId)
      responseHandler(response, 403, null, {
        message: `${email} this email is already taken`,
      });
      return;
    }

    // generate user ID
    let generatedUserId = v4();

    // Prepare query for user table
    await registerUser(generatedUserId, firstName, lastName, phoneNumber)

    // prepare query for user login table
    await createUserLogin(generatedUserId, email, password)

    // generate unique session ID
    let sessionId = v4();

    // generate session expiry -> currently 7D
    let session_expiry = moment()
      .add(process.env.SESSION_EXPIRY_IN_DAYS, "days")
      .toISOString();
    logger.debug(`service.register() Session expire date: ${session_expiry}`, traceId)
    // Create query

    await createSession(sessionId, generatedUserId, session_expiry, loginType);

    // generate JWT
    let token = generateJWT({
      userId: generatedUserId,
      sessionId,
    });
    logger.info(`Register successfully`, traceId)
    responseHandler(response, 200, { data: { token } }, null);
  } catch (error) {
    // exception block
    logger.error("service.register() Error: error in registerService")
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
};

// Logout user and invalidate token service
async function logoutUser({ sessionId, traceId }, response) {
  try {
    // Get session data
    let getSessionDataIs = await getSessionData(sessionId);
    if (getSessionDataIs && getSessionDataIs.length) {
      // compare session  expiry
      let { expiry } = getSessionDataIs[0];
      if (!moment().isBefore(expiry)) {
        logger.error("service.logoutUser() Error: Unauthorized", traceId)
        responseHandler(response, 400, null, {
          message: "Unauthorized",
        });
        return;
      }

      // Update session record
      await updateSessionData(sessionId)

      logger.info(`Logout successfully`, traceId)
      responseHandler(response, 200, { message: "Success" }, null);
    } else {
      responseHandler(response, 401, null, { message: "Unauthorized" });
    }
  } catch (error) {
    // exception block
    logger.error("service.logoutUser() Error: error in logoutUser")
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
}

// verify submitted OTP service
async function verifyOTP({ userId, type, incomingOTP, traceId }, response) {
  if (process.env.MOCK_OTP_LOGIN == true) {
    responseHandler(response, 200, { message: "Success" }, null);
  } else {
    // ----->  logic to verify OTP
    let verifyOtp = await getOtpData(userId, type, incomingOTP)

    if (verifyOtp && verifyOtp.length > 0) {
      // compare expiry
      let { expiry } = verifyOtp[0];

      if (!moment().isBefore(expiry)) {
        logger.error("service.verifyOTP() Error: OTP is expired", traceId)
        responseHandler(response, 400, null, {
          message: "OTP is expired",
        });
        return;
      }

      // if OTP is valid
      await updateOtpRecord(userId, type, incomingOTP)

      logger.info("OTP verified successfully", traceId)
      responseHandler(response, 200, { message: "Success" }, null);
    } else {
      logger.error("service.verifyOTP() Error: OTP is invalid", traceId)
      responseHandler(response, 400, null, {
        message: "OTP is invalid",
      });
    }
  }
}

// generate verification OTP service
async function sendOTP({ userId, type, user, traceId }, response) {
  try {
    let generatedOTP = Math.floor(100000 + Math.random() * 900000);
    logger.debug(`service.sendOTP() Generate OTP: ${generatedOTP}`, traceId)

    let recepient = "";
    if (type === VERIFY_EMAIL) {
      recepient = user.email;
    } else if (type === VERIFY_PHONE) {
      recepient = user.phone_number;
    }
    // generate OTP expiry -> currently 7D
    let OTPExpiry = moment()
      .add(process.env.SESSION_EXPIRY_IN_DAYS, "days")
      .toISOString();
    logger.debug(`service.sendOTP() OTP expire date: ${OTPExpiry}`, traceId)

    // invalidate all previously generated OTP's of same type
    await invalidateOtpOfSameType(userId, type);

    //  add OTP to database
    await generateOtp(userId, generatedOTP, type, recepient, OTPExpiry);

    // sending otp logic
    if (type === VERIFY_EMAIL) {
      let messageString = ` Hello, <br />
        Your verification OTP code is : ${generatedOTP}`;

      logger.debug(`Send OTP in email Email:${recepient}`, traceId)
      sendEmailOTP(recepient, "OTP Verification", messageString)
        .then(() => {
          // otp sent successfully
        })
        .catch(() => {
          // otp sending unsuccessful
        });
    } else if (type === VERIFY_PHONE) {
      logger.debug(`Send OTP in Mobile number. Mobile number:${recepient}`, traceId)
      sendMobileOTP()
        .then(() => {
          // otp sent successfully
        })
        .catch(() => {
          // otp sending unsuccessful
        });
    }

    logger.info(`OTP is sent UserId: ${userId} & OTP: ${generatedOTP}`, traceId)
    responseHandler(
      response,
      200,
      { message: `OTP is sent ${generatedOTP}`, userId },
      null
    );
  } catch (error) {
    logger.error("service.sendOTP() Error: Exception in sendOTP service", traceId)
    responseHandler(response, 200, null, {
      message: "Internal server error",
    });
  }
}

// register user using  auth token (currently for google) service
async function registerUserUsingGoogle(accessToken, loginType, traceId, response) {
  try {
    let userData = await googleAPICall(accessToken);
    if (userData) {
      let { email, firstName, lastName } = userData;

      let userAlreadyRegistered = await loginWithAuthToken(
        email,
        loginType,
        response
      );

      if (userAlreadyRegistered) {
        logger.info("Google login successfully", traceId)
        return;
      }

      // generate user ID
      let generatedUserId = v4();

      // Prepare query for user table
      await socialLogin(generatedUserId, firstName, lastName);

      // prepare query for user login table
      await createUserSocialLogin(generatedUserId, email);

      // generate unique session ID
      let sessionId = v4();

      // generate session expiry -> currently 7D
      let session_expiry = moment()
        .add(process.env.SESSION_EXPIRY_IN_DAYS, "days")
        .toISOString();
      logger.debug(`service.registerUserUsingGoogle() Session expire date: ${session_expiry}`, traceId)

      // Create session query
      await createSession(sessionId, generatedUserId, session_expiry, loginType);

      // generate JWT
      let token = generateJWT({
        userId: generatedUserId,
        sessionId,
      });
      logger.info("Google login successfully", traceId)
      responseHandler(response, 200, { data: { token } }, null);
    } else {
      logger.error("service.registerUserUsingGoogle() Error: Please provide valid data", traceId)
      responseHandler(response, 400, null, {
        message: "Please provide valid data",
      });
    }
  } catch (error) {
    logger.error("service.registerUserUsingGoogle() Error: exception in registerUserUsingGoogle", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
}

// register user using linkedIn token 
async function registerUserUsingLinkedIn(accessToken, loginType, traceId, response) {

  try {
    let userData = await linkedInApiCall(accessToken);
    if (userData) {
      let { email, firstName, lastName } = userData;

      let userAlreadyRegistered = await loginWithAuthToken(
        email,
        loginType,
        response
      );

      if (userAlreadyRegistered) {
        logger.info("Linkedin login successfully", traceId)
        return;
      }

      // generate user ID
      let generatedUserId = v4();

      // Prepare query for user table
      await socialLogin(generatedUserId, firstName, lastName);

      // prepare query for user login table
      await createUserSocialLogin(generatedUserId, email);

      // generate unique session ID
      let sessionId = v4();

      // generate session expiry -> currently 7D
      let session_expiry = moment()
        .add(process.env.SESSION_EXPIRY_IN_DAYS, "days")
        .toISOString();
      logger.debug(`service.registerUserUsingLinkedIn() Session expire date: ${session_expiry}`, traceId)

      // Create session query
      await createSession(sessionId, generatedUserId, session_expiry, loginType);

      // generate JWT
      let token = generateJWT({
        userId: generatedUserId,
        sessionId,
      });
      logger.info("Linkedin login successfully", traceId)
      responseHandler(response, 200, { data: { token } }, null);
    } else {
      logger.error("service.registerUserUsingLinkedIn() Error: Please provide valid data", traceId)
      responseHandler(response, 400, null, {
        message: "Please provide valid data",
      });
    }
  } catch (error) {
    logger.error("service.registerUserUsingLinkedIn() Error: exception in registerUserUsingLinkedIn", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
}

// register user using facebook token 
async function registerUserUsingFacebook(accessToken, loginType, traceId, response) {

  try {
    let userData = await facebookAPICall(accessToken);
    if (userData) {
      let { email, firstName, lastName } = userData;

      let userAlreadyRegistered = await loginWithAuthToken(
        email,
        loginType,
        response
      );

      if (userAlreadyRegistered) {
        logger.info("Facebook login successfully", traceId)
        return;
      }

      // generate user ID
      let generatedUserId = v4();

      // Prepare query for user table
      await socialLogin(generatedUserId, firstName, lastName);

      // prepare query for user login table
      await createUserSocialLogin(generatedUserId, email);

      // generate unique session ID
      let sessionId = v4();

      // generate session expiry -> currently 7D
      let session_expiry = moment()
        .add(process.env.SESSION_EXPIRY_IN_DAYS, "days")
        .toISOString();
      logger.debug(`service.registerUserUsingFacebook() Session expire date: ${session_expiry}`, traceId)

      // Create query
      await createSession(sessionId, generatedUserId, session_expiry, loginType);

      // generate JWT
      let token = generateJWT({
        userId: generatedUserId,
        sessionId,
      });
      logger.info("Facebook login successfully", traceId)
      responseHandler(response, 200, { data: { token } }, null);
    } else {
      responseHandler(response, 400, null, {
        message: "Please provide valid data",
      });
    }
  } catch (error) {
    logger.error("service.registerUserUsingFacebook() Error: exception in registerUserUsingFacebook", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
}

// utility for google and linkedin auth token registration and login process
async function loginWithAuthToken(email, loginType, response) {
  try {
    // prepare query
    let emailExist = await findEmail(email);

    // if user found
    if (emailExist && emailExist.length == 1) {
      let foundUser = emailExist[0];

      // generate unique session ID
      let sessionId = v4();

      // generate session expiry -> currently 7D
      let session_expiry = moment()
        .add(process.env.SESSION_EXPIRY_IN_DAYS, "days")
        .toISOString();

      // Create query
      await createSession(sessionId, foundUser[USER_ID], session_expiry, loginType)

      // generate JWT
      let token = generateJWT({
        userId: foundUser[USER_ID],
        sessionId,
      });

      responseHandler(response, 200, { data: { token } }, null);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logger.error("service.loginWithAuthToken() Error: error in loginWithAuthToken service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
}

// utility to check email availablity
async function checkIfEmailIsAvailable(email) {
  try {
    // prepare query
    let getUserData = await getUserEmailData(email)

    // if user found
    if (getUserData && getUserData.length > 0) {
      return false;
    } else {
      // if user not found
      return true;
    }
  } catch (error) {
    // exception block
    logger.error("service.checkIfEmailIsAvailable() Error: error in checkIfEmailIsAvailable service")
    return false;
  }
}

async function forgotPassword({ email, traceId }, response) {
  try {
    let isEmailAvailable = await checkIfEmailIsAvailable(email);

    if (isEmailAvailable) {
      logger.error("service.forgotPassword() Error:User does not exist with this email", traceId)
      responseHandler(response, 404, null, {
        message: 'User does not exist with this email',
      });
      return;
    }

    // Prepare query for user data by email
    let getUserData = await getUserEmailData(email)

    if (getUserData && getUserData.length > 0) {
      // generate otp
      let generatedOTP = Math.floor(100000 + Math.random() * 900000);
      logger.debug(`service.forgotPassword() Generate OTP: ${generatedOTP}`, traceId)

      // generate OTP expiry -> currently 7D
      let OTPExpiry = moment()
        .add(process.env.SESSION_EXPIRY_IN_DAYS, "days")
        .toISOString();
      logger.debug(`service.forgotPassword() OTP expire date: ${OTPExpiry}`, traceId)

      // invalidate all previously generated OTP's of same type
      await invalidateOtpOfSameType(getUserData[0].user_id, 'FORGOT_PASSWORD');

      //  add OTP to database
      await generateOtp(getUserData[0].user_id, generatedOTP, 'FORGOT_PASSWORD', email, OTPExpiry);
      let findMailTemplate = fs.readFileSync(forgotPasswordEmail, 'utf-8');
      let addOtpInEmail = findMailTemplate?.replace(/###otp###/gi, generatedOTP);

      logger.debug(`service.forgotPassword() Send OTP in email: ${email}`, traceId)
      sendEmailOTP(email, "Forgot password", addOtpInEmail)

      logger.info("Forgot password success", traceId)
      responseHandler(response, 200, { message: "Success" }, null);
    }
  } catch (error) {
    // exception block
    logger.error("service.forgotPassword() Error: error in forgotPassword service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
};

async function changePassword({ email, password, otp, traceId }, response) {
  try {
    let isEmailAvailable = await checkIfEmailIsAvailable(email);

    if (isEmailAvailable) {
      // If email exist in database
      logger.error("service.changePassword() Error: User does not exist with this email", traceId)
      responseHandler(response, 404, null, {
        message: 'User does not exist with this email',
      });
      return;
    }

    // Prepare query for get otp
    let getOtpDataIs = await getOtpDataForChangePassword(otp, email)

    if (getOtpDataIs && getOtpDataIs.length > 0) {
      // compare expiry
      let { expiry } = getOtpDataIs[0];

      if (!moment().isBefore(expiry)) {
        logger.error("service.changePassword() Error: OTP is expired", traceId)
        responseHandler(response, 400, null, {
          message: "OTP is expired",
        });
        return;
      }

      // if OTP is valid
      await updateOtpRecord(getOtpDataIs[0].user_id, 'FORGOT_PASSWORD', otp);

      // password update
      await updatePassword(password, getOtpDataIs[0].user_id, email);

      logger.info("change password successfully", traceId)
      responseHandler(response, 200, { message: "Success" }, null);
    } else {
      // If OTP is invalid
      logger.error("service.changePassword() Error: OTP is invalid", traceId)
      responseHandler(response, 400, null, {
        message: "OTP is invalid",
      });
    }
  } catch (error) {
    // exception block
    logger.error("service.changePassword() Error: error in changePassword service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
};

module.exports = {
  login,
  register,
  verifyOTP,
  sendOTP,
  logoutUser,
  registerUserUsingGoogle,
  registerUserUsingLinkedIn,
  registerUserUsingFacebook,
  forgotPassword,
  changePassword
};
