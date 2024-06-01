export class DatabaseConnectionError extends Error {
  reason = "Error connecting to database";
  constructor() {
    super();
    this.reason = "Error connecting to database";
    // Only because we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}