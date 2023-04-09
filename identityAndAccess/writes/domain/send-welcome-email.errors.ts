import {DomainServerError} from "../../../sharedKernel/domain/domainError";
import IdentityErrorCodes from "./identityErrorCodes";

export class SendWelcomeEmailErrors extends DomainServerError {
    readonly code = IdentityErrorCodes.SendWelcomeEmailError;

    constructor() {
        super(`Unexpected error`);
    }
}