"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResourceValidationError extends Error {
    constructor(message, errors) {
        super(message);
        this.name = 'ResourceValidationError';
        this.errors = errors;
    }
}
exports.ResourceValidationError = ResourceValidationError;
