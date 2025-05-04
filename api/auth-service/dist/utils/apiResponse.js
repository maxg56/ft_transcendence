"use strict";
// utils/apiResponse.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiSuccess = apiSuccess;
exports.apiError = apiError;
function apiSuccess(data, statusCode = 200) {
    return {
        statusCode,
        status: 'success',
        data,
    };
}
function apiError(message, statusCode = 400, errorCode) {
    return {
        statusCode,
        status: 'error',
        message,
        ...(errorCode && { code: errorCode }),
    };
}
