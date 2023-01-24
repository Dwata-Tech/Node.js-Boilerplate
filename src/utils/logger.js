// const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

const loggerFormat = printf(({ message, timestamp, traceId }) => {
    return `${timestamp} ${message} ${traceId}`;
});

const logger = {
    error: function error(message, traceId) {
        return winstonLogger.error(message, { traceId: traceId })
    },
    warn: function warn(message, traceId) {
        return winstonLogger.warn(message, { traceId: traceId })
    },
    info: function info(message, traceId) {
        return winstonLogger.info(message, { traceId: traceId })
    },
    http: function http(message, traceId) {
        return winstonLogger.http(message, { traceId: traceId })
    },
    verbose: function verbose(message, traceId) {
        return winstonLogger.verbose(message, { traceId: traceId })
    },
    debug: function debug(message, traceId) {
        return winstonLogger.debug(message, { traceId: traceId })
    }
}

const winstonLogger = createLogger({
    level: process.env.LOGGER_LEVEL,
    format: combine(errors({ stack: true }), timestamp(), loggerFormat, format.json()),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
    ],
});

function validateHeaders(request) {
    if (request.headers["x-request-id"]) {
        return true
    } else {
        return false
    }
}

module.exports = {
    winstonLogger,
    logger,
    validateHeaders
}