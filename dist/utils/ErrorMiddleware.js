"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Types");
function handleErrors(err, req, res, next) {
    let response = res['body'];
    if (!response) {
        response = new Types_1.ResponseWrapper();
        res['body'] = response;
    }
    const transactionId = req['transactionId'];
    //logger.debug(buildErrorMessage(err.name, err.message, transactionId, undefined), transactionId);
    switch (err.name) {
        case 'UnauthorizedError':
            response.errors = [formatError(new Error('Invalid authorization token'), Types_1.ResponseCode.UNAUTHORIZED, req)];
            response.statusCode = Types_1.ResponseCode.UNAUTHORIZED;
            break;
        case 'SequelizeValidationError':
            response.errors = err['errors'].map(e => buildErrorMessage('Validation Error', e.message, transactionId, e.path));
            response.statusCode = Types_1.ResponseCode.BAD_REQUEST;
            break;
        case 'Validation Error':
            const path = err.getPath();
            response.statusCode = Types_1.ResponseCode.BAD_REQUEST;
            response.errors = [buildErrorMessage(err.name, err.message, transactionId, path)];
            break;
        case 'SequelizeUniqueConstraintError':
            response.statusCode = Types_1.ResponseCode.BAD_REQUEST;
            response.errors = [buildErrorMessage(err.name, err.message, transactionId, undefined)];
            break;
        case 'MissingObjectError':
            response.statusCode = Types_1.ResponseCode.NOT_FOUND;
            response.errors = [buildErrorMessage(err.name, err.message, transactionId, err['path'])];
            break;
        case 'Forbidden':
            response.statusCode = Types_1.ResponseCode.FORBIDDEN;
            response.errors = [buildErrorMessage(err.name, err.message, transactionId, err['path'])];
            break;
        case 'SyntaxError':
            response.statusCode = Types_1.ResponseCode.BAD_REQUEST;
            response.errors = [buildErrorMessage(err.name, err.message, transactionId, undefined)];
            break;
        case 'ResourceValidationError':
            response.statusCode = Types_1.ResponseCode.BAD_REQUEST;
            response.errors = err.errors.map(error => buildErrorMessage(error.name, error.message, transactionId, error.getPath()));
            break;
        case 'PayloadTooLargeError':
            response.statusCode = Types_1.ResponseCode.BAD_REQUEST;
            response.errors = [buildErrorMessage(err.name, err.message, transactionId, undefined)];
            break;
        default:
            if (err['code']) {
                response.errors = [err];
                response.statusCode = err['code'];
            }
            else {
                response.errors = [formatError(new Error('An unknown error has occurred.'), Types_1.ResponseCode.UNEXPECTED_ERROR, req)];
                response.statusCode = Types_1.ResponseCode.UNEXPECTED_ERROR;
                //logger.error(err, req['transactionId'], req.body);
            }
    }
    next();
}
exports.handleErrors = handleErrors;
/**
* @deprecated use buildErrorMessage instead, which puts the error in the correct format.
*/
function formatError(err, statusCode, req) {
    const msg = err['parent'] ? err['parent']['message'] : err.message;
    return {
        title: err['type'] ? err['type'] : err.name,
        description: msg,
        source: `Request ID: ${req['transactionId']}`,
        code: statusCode ? statusCode : Types_1.ResponseCode.UNEXPECTED_ERROR
    };
}
exports.formatError = formatError;
function buildErrorMessage(title, description, transactionId, source) {
    return {
        code: transactionId,
        title,
        description,
        source
    };
}
exports.buildErrorMessage = buildErrorMessage;
