import {UnvalidatedUser, ValidatedUser} from "../../domain/register.types";
import {Either, Left, Right} from "purify-ts";
import {checkUserEmail} from "./checkUserEmail";
import {checkPassword} from "./checkPassword";
import {InvalidUser, ValidateUserErrors} from "../../domain/register.errors";
export const checkUserToRegister = (unvalidatedUser: UnvalidatedUser): Either<InvalidUser, ValidatedUser> => {
    const errors = Either.lefts<ValidateUserErrors, UnvalidatedUser>([
        checkUserEmail(unvalidatedUser),
        checkPassword(unvalidatedUser)
    ]);

    return errors.length > 0 ? Left(new InvalidUser(errors)) : Right(unvalidatedUser);
}