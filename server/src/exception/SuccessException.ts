export class SuccessException extends Error {
  constructor(
    public message: string,
    public result: any,
  ) {
    super();
  }
}
