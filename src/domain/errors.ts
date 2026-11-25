export type DomainErrorCode =
  | 'PROFESSIONAL_OVERLAP'
  | 'CHAIR_OVERLAP'
  | 'TENANT_MISMATCH'
  | 'RESOURCE_NOT_FOUND'
  | 'INVALID_SERVICE_DURATION'
  | 'INVALID_TIME_RANGE';

export class DomainError extends Error {
  public readonly code: DomainErrorCode;

  constructor(code: DomainErrorCode, message: string) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
  }
}
