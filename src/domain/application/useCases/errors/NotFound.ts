export class NotFound extends Error {
  constructor(entityName: string) {
    super(`${entityName} Not Found`);
  }
}
