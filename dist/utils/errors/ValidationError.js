"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(message, path) {
        super(message);
        this.name = 'Validation Error';
        this.path = path;
    }
    getPath() {
        return this.path;
    }
}
exports.ValidationError = ValidationError;
