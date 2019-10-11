import {ValidationError} from './ValidationError';

export class ResourceValidationError extends Error {

    public readonly errors: ValidationError[];

    constructor(message: string, errors: ValidationError[]) {
        super(message);
        this.name = 'ResourceValidationError';
        this.errors = errors;
    }

}