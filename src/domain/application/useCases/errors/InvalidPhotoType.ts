export class InvalidPhotoType extends Error {
  constructor(type: string) {
    super(`Invalid photo type: ${type}`);
  }
}
