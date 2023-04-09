import {EmailAlreadyUsed, EncryptUserError, InvalidUser} from "./register.errors";
import {DomainEvent} from "../../../sharedKernel/domain/domainEvent";

export type UnvalidatedEmail = string;
export type Email = string;
export type UnvalidatedPassword = string;
export type Password = string;
export type EncryptedPassword = string;
export type UserId = string;

export type UnvalidatedUser = {
    email: UnvalidatedEmail,
    password: UnvalidatedPassword
}

export type ValidatedUser = {
    email: Email,
    password: Password,
}

export type EncryptedUser = {
    email: Email,
    password: EncryptedPassword
}

export type User = {
    id: UserId
    email: Email,
    password: EncryptedPassword
}

export abstract class RegisterEvents extends DomainEvent {

}
export type RegisterErrors = InvalidUser | EncryptUserError | EmailAlreadyUsed;

export class UserRegister extends RegisterEvents {
    constructor(readonly userId: UserId, readonly email: Email) {
        super();
    }
}