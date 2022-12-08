import {Either} from "purify-ts";
import {RegisterErrors, RegisterEvents} from "../../writes/domain/register.types";
import {InvalidUser} from "../../writes/domain/register.errors";

export function checkError(result: Either<RegisterErrors, RegisterEvents>, error: RegisterErrors) {
    expect(result.isLeft()).toBeTruthy();
    result.ifLeft(x => expect(x).toStrictEqual(error));
}