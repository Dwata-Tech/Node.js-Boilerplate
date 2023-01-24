// custom imports
const { responseHandler } = require("./../utils/responseHandler");
const { query } = require("./../data/connect");
const moment = require("moment")
const {
  USER_TABLE,
  USER_LOGIN_TABLE,
  EMAIL,
  USER_ID,
  FIRST_NAME,
  LAST_NAME,
  PHONE_NUMBER,
  dbSchema,
  IS_BLOCKED,
  SESSION_TABLE,
  SESSION_ID,
  IS_VALID,
} = require("./../data/dbConstants");
const { getUserByEmail, updateUser, findUserDetailsByUserId } = require("./../data/user_dao");
const { updateBlockStatus, updateUserEmail } = require("./../data/user_login_dao");
const { getSessionData } = require("./../data/session_dao");
const { logger } = require("../utils/logger");

// Check Is User Exist controller
const findUserById = async ({ userId, traceId }, response) => {
  try {
    // prepare query
    const findUser = await findUserDetailsByUserId(userId);
    // if user found
    if (findUser && findUser.length == 1) {
      let foundUser = findUser[0];
      logger.info("Find user by id success", traceId)

      responseHandler(response, 200, { data: { user: foundUser } }, null);
    } else {
      // if user not found
      logger.error("service.findUserById() Error: User not found", traceId)
      responseHandler(response, 404, null, {
        message: "User not found",
      });
    }
  } catch (error) {
    // exception block
    logger.error("service.findUserById() Error: error in findUserById service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
};

// findUserbyEmail controller
const findUserByEmail = async ({ email, traceId }, response) => {
  try {
    // prepare query
    const findUser = await getUserByEmail(email);

    // if user found
    if (findUser && findUser.length > 0) {
      let foundUser = findUser[0];
      logger.info("Find user by email success", traceId)
      responseHandler(response, 200, { data: { isUserExist: true } }, null);
    } else {
      // if user not found
      logger.error("service.findUserByEmail() Error: User not found", traceId)
      responseHandler(response, 200, { data: { isUserExist: false } }, null);
    }
  } catch (error) {
    // exception block
    logger.error("service.findUserByEmail() Error: error in findUserByEmail service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
};

// update user status
const updateUserStatus = async ({ status, userId, traceId }, response) => {
  try {
    // find user and update status in user_login table
    let updateBlock = await updateBlockStatus(status, userId);

    // if user found
    if (updateBlock && updateBlock > 0) {
      logger.info("Update user status success", traceId)
      responseHandler(response, 200, { message: "success" }, null);
    } else {
      // if user not found
      logger.error("service.updateUserStatus() Error: User not found", traceId)
      responseHandler(response, 404, null, { message: "User not found" });
    }
  } catch (error) {
    // exception block
    logger.error("service.updateUserStatus() Error: error in updateUserStatus service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
};

// update user status
const updateUserDetails = async (
  { id, firstName, lastName, email, phoneNumber, traceId },
  response
) => {
  try {
    let first_name = "";
    let last_name = "";
    let phone_number = "";
    if (firstName) {
      first_name =
        first_name + ' "' + FIRST_NAME + "\" = '" + firstName + "' ";
    }
    if (lastName) {
      last_name =
        last_name + ' "' + LAST_NAME + "\" = '" + lastName + "' ";
    }
    if (phoneNumber) {
      phone_number =
        phone_number + ' "' + PHONE_NUMBER + "\" = '" + phoneNumber + "' ";
    }

    await updateUser(first_name, last_name, phone_number, id);

    if (email) {
      // find user and update status in user_login table
      await updateUserEmail(email, id);
    }
    logger.info("Update user details success", traceId)
    responseHandler(response, 200, { message: "success" }, null);
  } catch (error) {
    // exception block
    logger.error("service.updateUserDetails() Error: error in updateUserDetails service", traceId)
    responseHandler(response, 500, null, { message: "Internal server error" });
  }
};

/*--------------> Utility Functions  <------------------- */

// find user by id
const findUserByUserId = async (userId) => {
  try {
    // prepare query
    const findUser = await findUserDetailsByUserId(userId);
    // if user found
    if (findUser && findUser.length == 1) {
      let foundUser = findUser[0];
      logger.info("User found success")
      return foundUser;
    } else {
      // if user not found
      return null;
    }
  } catch (error) {
    // exception block
    logger.error("service.findUserByUserId() Error: error in findUserByUserId service")
    return null;
  }
};

const findValidSessionBySessionId = async (sessionId) => {
  try {
    let getSession = await getSessionData(sessionId);

    if (getSession && getSession.length > 0) {
      let { expiry } = getSession[0];
      logger.debug(`service.findValidSessionBySessionId() Session expire date: ${expiry}`)
      if (!moment().isBefore(expiry)) {
        return false;
      }
      return true
    } else {
      return false
    }
  } catch (error) {
    logger.error("service.findValidSessionBySessionId() Error: error in findValidSessionBySessionId service")
    return false
  }
};

module.exports = {
  findUserById,
  findUserByEmail,
  updateUserStatus,
  updateUserDetails,
  findUserByUserId,
  findValidSessionBySessionId,
};
