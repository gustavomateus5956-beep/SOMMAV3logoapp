/**
 * Erros padronizados da camada de dados e persistência do SOMMA+.
 * Totalmente desacoplados de bibliotecas de interface, React ou protocolos de rede.
 */

export class DataAccessError extends Error {
  public readonly code: string;
  public readonly originalError?: unknown;

  constructor(message: string, code = 'DATA_ACCESS_ERROR', originalError?: unknown) {
    super(message);
    this.name = 'DataAccessError';
    this.code = code;
    this.originalError = originalError;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class EntityNotFoundError extends DataAccessError {
  constructor(entityName: string, idOrKey: string) {
    super(`${entityName} com identificador "${idOrKey}" não foi encontrado.`, 'ENTITY_NOT_FOUND');
    this.name = 'EntityNotFoundError';
  }
}

export class ValidationError extends DataAccessError {
  constructor(message: string, code = 'VALIDATION_ERROR') {
    super(message, code);
    this.name = 'ValidationError';
  }
}
