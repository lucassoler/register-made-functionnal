import {RegisterErrors, RegisterEvents} from "../../writes/domain/register.types";
import * as E from 'fp-ts/Either';
import {expect} from "vitest";


export function checkError(result: E.Either<RegisterErrors, RegisterEvents>, error: RegisterErrors) {
    expect(E.isLeft(result)).toBeTruthy();
    expect(result).toEqual(E.left(error));
}