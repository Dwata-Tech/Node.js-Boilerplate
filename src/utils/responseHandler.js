function responseHandler (response,statusCode, data, error) {
    if (error) {
        response.status(statusCode).json(error)
        return;
    } 
    response.status(statusCode).json(data)
}

module.exports.responseHandler = responseHandler