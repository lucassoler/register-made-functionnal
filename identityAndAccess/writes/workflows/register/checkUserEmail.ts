import {UnvalidatedUser} from "../../domain/register.types";
import {Either, Left, Right} from "purify-ts";
import {InvalidEmail} from "../../domain/register.errors";

export function checkUserEmail(unvalidatedUser: UnvalidatedUser): Either<InvalidEmail, UnvalidatedUser> {
    if (!unvalidatedUser.email.includes("@")) {
        return Left(new InvalidEmail());
    }

    return Right(unvalidatedUser);
}