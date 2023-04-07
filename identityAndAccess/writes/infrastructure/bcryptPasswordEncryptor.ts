import {PasswordEncryptorService} from "../domain/ports/passwordEncryptor";
import {EncryptedPassword, Password} from "../domain/register.types";
import {EitherAsync, Right} from "purify-ts";
import {EncryptUserError} from "../domain/register.errors";
import bcrypt from "bcrypt";

export class BcryptPasswordEncryptor implements PasswordEncryptorService {
    encrypt(password: Password): EitherAsync<EncryptUserError, EncryptedPassword> {
        const encrypted = bcrypt.hashSync(password, 10);
        return EitherAsync.liftEither(Right(encrypted));
    }
}