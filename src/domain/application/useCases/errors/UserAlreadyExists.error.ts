export class UserAlreadyExists extends Error {
  constructor() {
    super("User already exists with this email or cpf");
  }
}
