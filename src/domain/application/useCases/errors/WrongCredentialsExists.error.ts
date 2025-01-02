export class WrongCredentialsExists extends Error {
  constructor() {
    super("Crendetials are't valid.");
  }
}
