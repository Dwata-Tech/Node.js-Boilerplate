const axios = require("axios");
const { logger } = require("./logger");

async function apiHandler(config) {
  try {
    let response = await axios(config);
    return response;
  } catch (error) {
    logger.error(`apiHandler() Error: ${error}`)
  }
}

module.exports.apiHandler = apiHandler;
