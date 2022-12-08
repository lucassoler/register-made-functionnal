import {EmailAlreadyUsed, EncryptUserError, InvalidUser} from "./register.errors";

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

export type RegisterEvents = string;
export type RegisterErrors = InvalidUser | EncryptUserError | EmailAlreadyUsed;

export const UserRegister: RegisterEvents = "User registered";