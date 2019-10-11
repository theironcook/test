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