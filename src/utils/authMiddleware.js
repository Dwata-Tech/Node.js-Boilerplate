const { findUserByUserId, findValidSessionBySessionId } = require("../services");
const { responseHandler } = require("./responseHandler");
const jwt = require("jsonwebtoken");
const { logger } = require("./logger");

async function authMiddleware(request, response, next) {
  try {
    let { authorization } = request.headers;
    if (authorization) {
      let token = authorization.split(" ")[1];
      try {
        let { userId, sessionId } = jwt.verify(token, process.env.JWT_SECRET);
        // check session expiry

        let sessionExpiry = await findValidSessionBySessionId(sessionId)
        if (!sessionExpiry) {
          // session expired
          responseHandler(response, 401, null, { message: "Unauthorized" });
          return;
        }
        let user = await findUserByUserId(userId);
        if (user) {
          request.user = { ...user, sessionId };
          next();
        } else {
          // user not found
          responseHandler(response, 401, null, { message: "Something went wrong" });
        }
      } catch (error) {
        // if error occured while decoding token
        logger.error(`authMiddleware() Error: Invalid token`)
        responseHandler(response, 401, null, { message: "Invalid token" });
        return;
      }
    } else {
      // no token provided
      responseHandler(response, 401, null, { message: "Unauthorized" });
      return;
    }
  } catch (error) {
    logger.error("authMiddleware() Error: error in authMiddleware")
    responseHandler(response, 401, null, { message: "Internal server error" });
  }
}

module.exports.authMiddleware = authMiddleware;
