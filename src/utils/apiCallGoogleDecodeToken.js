const axios = require("axios")

module.exports.googleAPICall = async function (access_token) {
    try {
        let userProfile = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
        );
        let { data } = userProfile;

        let { email, name } = data

        let firstName = name.split(" ")[0] ? name.split(" ")[0] : "demo"

        let lastName = name.split(" ")[1] ? name.split(" ")[1] : "demo"

        return { email, firstName, lastName }

    } catch (error) {
        logger.info("utils.googleAPICall() Error: error in google API call")
        return {};
    }
}