import {UnvalidatedUser} from "../../domain/register.types";
import * as E from "fp-ts/Either";
import {InvalidEmail} from "../../domain/register.errors";
import {left, right} from "fp-ts/Either";


export function checkUserEmail(unvalidatedUser: UnvalidatedUser): E.Either<InvalidEmail, UnvalidatedUser> {
    if (!unvalidatedUser.email.includes("@")) {
        return left(new InvalidEmail());
    }

    return right(unvalidatedUser);
}
