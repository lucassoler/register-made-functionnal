import {DomainServerError} from "../../../sharedKernel/domain/domainError";
import IdentityErrorCodes from "./identityErrorCodes";
import {Email} from "./register.types";

export class PersistResetPasswordTokenError extends DomainServerError {
    readonly code = IdentityErrorCodes.PersistResetPasswordTokenError;

    constructor() {
        super(`Unexpected error`);
    }
}

export class EmailDoesNotExists extends DomainServerError {
    readonly code = IdentityErrorCodes.EmailDoesNotExists;

    constructor(readonly email: Email) {
        super(`email ${email} does not exists`);
    }
}

export type SendResetPasswordEmailErrors = SendResetPasswordEmailError;

export class SendResetPasswordEmailError extends DomainServerError {
    readonly code = IdentityErrorCodes.SendResetPasswordEmailError;

    constructor() {
        super(`Unexpected error`);
    }
}