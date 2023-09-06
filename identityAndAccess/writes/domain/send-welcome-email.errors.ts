import {DomainServerError} from "../../../sharedKernel/domain/domainError";
import IdentityErrorCodes from "./identityErrorCodes";

export class SendWelcomeEmailError extends DomainServerError {
    readonly code = IdentityErrorCodes.SendWelcomeEmailError;

    constructor() {
        super(`Unexpected error`);
    }
}

export type SendWelcomeEmailErrors = SendWelcomeEmailError;