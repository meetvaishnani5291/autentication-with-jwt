class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
class AutenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AutenticationError";
  }
}
class DBError extends Error {
  constructor(message) {
    super(message);
    this.name = "DBError";
  }
}

module.exports = {
  ValidationError,
  AutenticationError,
  DBError,
};
