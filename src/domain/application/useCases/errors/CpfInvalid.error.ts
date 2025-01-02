export class CpfInvalid extends Error {
  constructor() {
    super("The CPF is not a format valid");
  }
}
