import {PasswordEncryptorService} from "../domain/ports/passwordEncryptor";
import {EncryptedPassword, Password} from "../domain/register.types";
import {EncryptUserError} from "../domain/register.errors";
import bcrypt from "bcrypt";
import * as TE from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";

export class BcryptPasswordEncryptor implements PasswordEncryptorService {
    encrypt(password: Password): TE.TaskEither<EncryptUserError, EncryptedPassword> {
        const encrypted = bcrypt.hashSync(password, 10);

        return pipe(
            () => Promise.resolve(encrypted),
            TE.fromTask,
        );
    }
}