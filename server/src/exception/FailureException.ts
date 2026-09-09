export class FailureException extends Error {
  constructor(
    public message: string,
    public result: any,
  ) {
    super();
  }
}
