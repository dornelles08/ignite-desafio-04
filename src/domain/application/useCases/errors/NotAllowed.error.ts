export class NotAllowed extends Error {
  constructor() {
    super("Action not allowed for this user");
  }
}
