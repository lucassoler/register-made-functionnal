import {Email} from "./register.types";
import {DomainEvent} from "../../../sharedKernel/domain/domainEvent";
import {
    EmailDoesNotExists,
    PersistResetPasswordTokenError,
    SendResetPasswordEmailErrors
} from "./request-reset-password.errors";

export type UnvalidatedResetPasswordRequest = {
    email: Email
}
export type ValidatedResetPasswordRequest = UnvalidatedResetPasswordRequest;


export type ResetPasswordToken = string;

export type ResetPasswordRequest = ValidatedResetPasswordRequest & {
    token: ResetPasswordToken
};

export type RequestResetPasswordErrors =
    PersistResetPasswordTokenError
    | EmailDoesNotExists
    | SendResetPasswordEmailErrors;


export class ResetPasswordFlowInitiated extends DomainEvent {
    constructor(readonly email: Email) {
        super();
    }
}