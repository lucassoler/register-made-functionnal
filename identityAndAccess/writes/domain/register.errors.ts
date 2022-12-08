import {DomainConflictError, DomainError, DomainValidationError} from "../../../sharedKernel/domain/domainError";
import IdentityErrorCodes from "./identityErrorCodes";

export class EmailAlreadyUsed extends DomainConflictError {
    readonly code = IdentityErrorCodes.EmailAlreadyUsed;

    constructor(email: string) {
        super(`email "${email}" already used`);
    }
}

export class InvalidEmail extends DomainValidationError {
    readonly code = IdentityErrorCodes.EmailInvalid;

    constructor() {
        super(`email invalid`);
    }
}

export class InvalidPassword extends DomainValidationError {
    readonly innerExceptions: Array<DomainError> = [];
    readonly code = IdentityErrorCodes.PasswordInvalid;

    constructor(errors: Array<DomainError>) {
        super("password invalid for the following reasons " + errors.map(x => x.message).join(","));
        this.innerExceptions = errors;
    }
}

export class PasswordShouldHaveAMinimumLength extends DomainValidationError {
    readonly code = IdentityErrorCodes.PasswordShouldHaveAMinimumLength;

    constructor(minimumLength: number) {
        super(`Password should have a minimum length of ${minimumLength} characters`);
    }
}

export class PasswordShouldContainsSpecialCharacters extends DomainValidationError {
    readonly code = IdentityErrorCodes.PasswordShouldContainsSpecialCharacters;

    constructor() {
        super(`Password should contains special characters`);
    }
}

export class InvalidUser extends DomainValidationError {
    readonly innerExceptions: Array<DomainError> = [];
    readonly code = IdentityErrorCodes.InvalidUser;

    constructor(errors: Array<DomainError>) {
        super("user invalid for the following reasons " + errors.map(x => x.message).join(","));
        this.innerExceptions = errors;
    }
}

export class EncryptionServiceError extends DomainValidationError {
    readonly code = IdentityErrorCodes.EncryptionServiceError;

    constructor() {
        super(`encryption service error`);
    }
}

export type InvalidPasswordErrors = PasswordShouldHaveAMinimumLength | PasswordShouldContainsSpecialCharacters;
export type ValidateUserErrors = InvalidEmail | InvalidPassword;
export type EncryptUserError = EncryptionServiceError;