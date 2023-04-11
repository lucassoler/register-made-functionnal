import {UnvalidatedUser} from "../../domain/register.types";
import * as E from "fp-ts/Either";
import {
    InvalidPassword,
    PasswordShouldContainsSpecialCharacters,
    PasswordShouldHaveAMinimumLength
} from "../../domain/register.errors";
import {DomainValidationError} from "../../../../sharedKernel/domain/domainError";
import {pipe} from "fp-ts/function";
import * as A from "fp-ts/Array";
import {left, right} from "fp-ts/Either";

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