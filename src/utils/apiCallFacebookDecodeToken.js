const axios = require("axios");
const { logger } = require("./logger");

module.exports.facebookAPICall = async function (access_token) {
    try {
        let userProfile = await axios.get(
            `https://graph.facebook.com/me?fields=id,first_name,last_name,email&access_token=${access_token}`
        );
        let { data } = userProfile;

        let { first_name, last_name, email } = data

        return { email, firstName: first_name, lastName: last_name }

    } catch (error) {
        logger.info("utils.facebookAPICall() Error: error in facebook API call")
        return {};
    }
}