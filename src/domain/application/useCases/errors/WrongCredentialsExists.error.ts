export class WrongCredentialsExistsError extends Error {
  constructor() {
    super("Crendetials are't valid.");
  }
}
