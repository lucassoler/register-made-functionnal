import {UnvalidatedUser, ValidatedUser} from "../../domain/register.types";
import { pipe } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import {
    InvalidUser
} from "../../domain/register.errors";
import {DomainValidationError} from "../../../../sharedKernel/domain/domainError";
import {checkPassword} from "./checkPassword";
import {checkUserEmail} from "./checkUserEmail";


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
