export const warnError = (errorName = 'somethingWentWrong', error = {}, { createModal } = {}) => {
  if (createModal) return createModal?.(errorName, { error });
  console.error('no handleError handlers specified!');
}

export class FetchError extends Error {
  constructor(meta = {}) {
    super('No response from server');
    Object.assign(this, meta);
    this.name = 'FetchError';
  }
}

export class ServerError extends Error {
  constructor({ status, message, error } = {
    status: 500,
    message: 'Unknown server error',
    error: {}
  }) {
    super(`Server error ${status}: ${message}`);
    Object.assign(this, { status, message, error: JSON.stringify(error) });
    this.name = 'ServerError';
  }
}