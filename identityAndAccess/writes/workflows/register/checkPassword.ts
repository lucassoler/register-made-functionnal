import {
    UnvalidatedUser
} from "../../domain/register.types";
import {Either, Left, Right} from "purify-ts";
import {
    InvalidPassword,
    InvalidPasswordErrors,
    PasswordShouldContainsSpecialCharacters,
    PasswordShouldHaveAMinimumLength
} from "../../domain/register.errors";

export const MIN_PASSWORD_LENGTH = 6;

export function checkPassword(unvalidatedUser: UnvalidatedUser): Either<InvalidPassword, UnvalidatedUser> {
    const errors = Either.lefts<InvalidPasswordErrors, UnvalidatedUser>([
        checkPasswordLength(unvalidatedUser),
        checkPasswordSpecialCharacters(unvalidatedUser)
    ]);

    if (errors.length > 0) {
        return Left(new InvalidPassword(errors));
    }

    return Right(unvalidatedUser);
}

function checkPasswordLength(unvalidatedUser: UnvalidatedUser): Either<PasswordShouldHaveAMinimumLength, UnvalidatedUser> {
    if (unvalidatedUser.password.length < MIN_PASSWORD_LENGTH) {
        return Left(new PasswordShouldHaveAMinimumLength(MIN_PASSWORD_LENGTH));
    }
    return Right(unvalidatedUser);
}

function checkPasswordSpecialCharacters(unvalidatedUser: UnvalidatedUser): Either<PasswordShouldContainsSpecialCharacters, UnvalidatedUser> {
    if (!/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/.test(unvalidatedUser.password)) {
        return Left(new PasswordShouldContainsSpecialCharacters());
    }

    return Right(unvalidatedUser);
}