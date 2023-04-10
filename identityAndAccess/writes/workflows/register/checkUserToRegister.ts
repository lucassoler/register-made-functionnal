import {UnvalidatedUser, ValidatedUser} from "../../domain/register.types";
import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import {
    InvalidEmail,
    InvalidPassword,
    InvalidUser, PasswordShouldContainsSpecialCharacters, PasswordShouldHaveAMinimumLength
} from "../../domain/register.errors";
import {DomainValidationError} from "../../../../sharedKernel/domain/domainError";
import {left, right} from "fp-ts/Either";


export const checkUserToRegister = (unvalidatedUser: UnvalidatedUser): E.Either<InvalidUser, ValidatedUser> => {
    const errors: DomainValidationError[] = pipe(
        [
            checkUserEmail(unvalidatedUser),
            checkPassword(unvalidatedUser),
        ],
        A.lefts,
    );

    return errors.length > 0
        ? E.left(new InvalidUser(errors))
        : E.right(unvalidatedUser);
};

export function checkUserEmail(unvalidatedUser: UnvalidatedUser): E.Either<InvalidEmail, UnvalidatedUser> {
    if (!unvalidatedUser.email.includes("@")) {
        return left(new InvalidEmail());
    }

    return right(unvalidatedUser);
}

export const MIN_PASSWORD_LENGTH = 6;

export function checkPassword(unvalidatedUser: UnvalidatedUser): E.Either<InvalidPassword, UnvalidatedUser> {
    const errors: DomainValidationError[] = pipe(
        [
            checkPasswordLength(unvalidatedUser),
            checkPasswordSpecialCharacters(unvalidatedUser)
        ],
        A.lefts,
    );

    if (errors.length > 0) {
        return left(new InvalidPassword(errors));
    }

    return right(unvalidatedUser);
}

function checkPasswordLength(unvalidatedUser: UnvalidatedUser): E.Either<PasswordShouldHaveAMinimumLength, UnvalidatedUser> {
    if (unvalidatedUser.password.length < MIN_PASSWORD_LENGTH) {
        return left(new PasswordShouldHaveAMinimumLength(MIN_PASSWORD_LENGTH));
    }
    return right(unvalidatedUser);
}

function checkPasswordSpecialCharacters(unvalidatedUser: UnvalidatedUser): E.Either<PasswordShouldContainsSpecialCharacters, UnvalidatedUser> {
    if (!/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/.test(unvalidatedUser.password)) {
        return left(new PasswordShouldContainsSpecialCharacters());
    }

    return right(unvalidatedUser);
}