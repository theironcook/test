export class MissingObjectError extends Error {
  constructor (message: string) {
      super(message);
      this.name = 'MissingObjectError';
  }
}


export class ValidationError extends Error {
  private readonly path: string | undefined;

  constructor (message: string, path?: string) {
      super(message);
      this.name = 'Validation Error';
      this.path = path;
  }

  public getPath(): string | undefined {
      return this.path;
  }
}


// export class ResourceValidationError extends Error {

//   public readonly errors: ValidationError[];

//   constructor(message: string, errors: ValidationError[]) {
//       super(message);
//       this.name = 'ResourceValidationError';
//       this.errors = errors;
//   }

// }
