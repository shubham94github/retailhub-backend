'use strict';

var _ = require('lodash');

const VALIDATION_ERROR_KEY = 'Validation Error';
const REQUEST_VALIDATION_ERROR_KEY = 'Request Validation error';
const DUPLICATE_ERROR_KEY = 'Duplicate Error';
const NOT_FOUND_ERROR_KEY = 'Not Found Error';
const NOT_AUTHORIZED_ERROR_KEY = 'Not Authorize Error';
const TOO_MANY_REQUESTS_ERROR_KEY = 'Too many requests';
const VALIDATION_ERROR = 'validationError';

exports.createResponseHandler = createResponseHandler;
exports.createDeleteResponseHandler = createDeleteResponseHandler;
exports.createErrorHandler = createErrorHandler;
exports.wrapValidationError = wrapValidationError;

exports.VALIDATION_ERROR_KEY = VALIDATION_ERROR_KEY;
exports.REQUEST_VALIDATION_ERROR_KEY = REQUEST_VALIDATION_ERROR_KEY;
exports.DUPLICATE_ERROR_KEY = DUPLICATE_ERROR_KEY;
exports.NOT_FOUND_ERROR_KEY = NOT_FOUND_ERROR_KEY;
exports.NOT_AUTHORIZED_ERROR_KEY = NOT_AUTHORIZED_ERROR_KEY;
exports.TOO_MANY_REQUESTS_ERROR_KEY = TOO_MANY_REQUESTS_ERROR_KEY;
exports.VALIDATION_ERROR = VALIDATION_ERROR;

/**
 * @author Kamal Bhera
 * @description Create Response Handler to send response data
 * @param {*} request 
 * @param {*} response 
 * @param {*} statusCode 
 * @returns 
 */
function createResponseHandler(request, response, statusCode) {
    return function (data) {
        if (data) {
            if (statusCode) {
                response.status(statusCode);
            }
            return response.send(data);
        }
        return response.status(404).send(buildErrorResponse(request, { message: 'Not found<<<responseHelper.js' }));
    };
}

/**
 * @author Kamal Bhera
 * @description Create response for delete data from mongodb  
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
function createDeleteResponseHandler(request, response) {
    return function (data) {
        if (data.n === 1 && data.ok === 1 || data.result.n === 1 && data.result.ok === 1) {
            return response.send(data);
        } else if (data.result.n === 0 && data.result.ok === 1) {
            return response.status(404).send(buildErrorResponse(request, { message: 'Not found' }));
        }
        return response.status(500).send(buildErrorResponse(request, { message: 'Error deleting object' }));
    };
}

/**
 * @author Kamal Bhera
 * @description Create Error response for all API
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
function createErrorHandler(request, response, next) {
    return function (error) {
        if (error) {
            var responseMessage = buildErrorResponse(request, error);
            if (error.type === VALIDATION_ERROR_KEY) {
                return response.status(400).send(responseMessage);
            } else if (error.type === NOT_FOUND_ERROR_KEY) {
                return response.status(404).send(responseMessage);
            } else if (error.type === DUPLICATE_ERROR_KEY) {
                return response.status(409).send(responseMessage);
            } else if (error.type === NOT_AUTHORIZED_ERROR_KEY) {
                return response.status(403).send(responseMessage);
            } else if (error.type === REQUEST_VALIDATION_ERROR_KEY) {
                return response.status(422).send(responseMessage);
            } else if (error.type === TOO_MANY_REQUESTS_ERROR_KEY) {
                return response.status(429).send(responseMessage);
            } else {
                return next(error);
            }
        }
    };
}

function buildErrorResponse(request, error) {
    if (error && error.type) {
        return { url: request.originalUrl, message: error.message, type: error.type };
    }
    return { url: request.originalUrl, message: error.message };
}

/**
 * @description Handle validatior error and giver error resposne with message
 * @param {*} errors 
 * @returns 
 */
function wrapValidationError(errors) {
    var stringifiedErrorMessages = stringifyErrorMessages(errors);
    return {
        type: VALIDATION_ERROR_KEY,
        message: Object.keys(errors)[0] == VALIDATION_ERROR ? errors.validationError : stringifiedErrorMessages
    };
}

function stringifyErrorMessages(errors) {
    var message = '';
    return _.map(errors, function (error) {
        return message + _.head(error);
    });
}
