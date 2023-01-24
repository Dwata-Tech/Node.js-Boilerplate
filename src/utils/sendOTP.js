const twilio = require("twilio");
const { logger } = require("./logger");

function sendMobileOTP(phoneNumber, messageString) {
    return new Promise(async (resolve, reject) => {
        // Load configuration information from system environment variables.
        const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
        const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
        const TWILLIO_SERVICE_ID = process.env.TWILLIO_SERVICE_ID;

        // Create an authenticated client to access the Twilio REST API
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        try {
            // Use the REST client to send a text message
            let twillioResponse = await client.messages.create({
                to: phoneNumber,
                messagingServiceSid: TWILLIO_SERVICE_ID,
                body: messageString,
            });
            resolve(true)
        } catch (error) {
            logger.error(`sendMobileOTP() Error: ${error}`)
            reject(false)
        }
    })
}


module.exports.sendMobileOTP = sendMobileOTP