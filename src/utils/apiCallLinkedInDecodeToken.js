const axios = require("axios");

module.exports.linkedInApiCall = async function (access_token) {
  try {
    // query basic detials
    let config = {
      method: "get",
      url: "https://api.linkedin.com/v2/me",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    let { data: apiResponseForDetails } = await axios(config);

    let { localizedLastName, localizedFirstName } = apiResponseForDetails;

    // query email address
    config = {
      method: 'get',
      url: 'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))',
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    };

    let { data: apiResponseForEmail } = await axios(config);

    let { elements } = apiResponseForEmail

    let email = elements[0]["handle~"].emailAddress

    return {
      firstName: localizedFirstName,
      lastName: localizedLastName,
      email
    }
  } catch (error) {
    logger.info("utils.linkedInApiCall() Error: error in linkedin API call")
    return {};
  }
};
