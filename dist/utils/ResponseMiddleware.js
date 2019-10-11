"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Types");
const ErrorMiddleware_1 = require("./ErrorMiddleware");
const hrTimeStr = 'hrtime';
function handleBuildResponseWrapper(req, res, next) {
    res['body'] = new Types_1.ResponseWrapper();
    next();
}
exports.handleBuildResponseWrapper = handleBuildResponseWrapper;
function handleStartTimer(req, res, next) {
    res.set(hrTimeStr, process.hrtime().toString());
    next();
}
exports.handleStartTimer = handleStartTimer;
function handleResponse(req, res, next) {
    const response = res.body;
    const responseTimeStr = 'Response-Time';
    if (req['correlationId'] !== req['transactionId']) {
        if (!response.meta) {
            response.meta = {};
        }
        response.meta['correlationId'] = req['correlationId'];
    }
    const hrTime = buildHrTime(res.getHeader(hrTimeStr));
    res.removeHeader(hrTimeStr);
    const time = process.hrtime(hrTime);
    const ms = Math.trunc((time[0] * 1000) + (time[1] / 1000000.0));
    res.header(responseTimeStr, ms.toString());
    if (response.data === undefined && response.errors === undefined && response.warnings === undefined) {
        response.statusCode = Types_1.ResponseCode.NOT_FOUND;
        res.status(response.statusCode).send({
            statusCode: response.statusCode,
            errors: [ErrorMiddleware_1.formatError(new Error('Page not found'), Types_1.ResponseCode.NOT_FOUND, req)]
        });
    }
    else {
        res.status(response.statusCode).send({
            statusCode: response.statusCode,
            data: response.data,
            warnings: response.warnings,
            errors: response.errors,
            meta: response.meta
        });
    }
    next();
}
exports.handleResponse = handleResponse;
;
function buildHrTime(str) {
    return str.split(',').map((item) => parseInt(item, 10));
}
