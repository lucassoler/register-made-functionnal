import {EncryptedPassword, Password} from "../domain/register.types";
import {EitherAsync, Right} from "purify-ts";
import {PasswordEncryptorService} from "../domain/ports/passwordEncryptor";
import {EncryptUserError} from "../domain/register.errors";

export class FakePasswordEncryptor implements PasswordEncryptorService {
    static ENCRYPTION_KEY = "_ENCRYPTED";
    encrypt(password: Password): EitherAsync<EncryptUserError, EncryptedPassword> {
        return EitherAsync.liftEither(Right(password + FakePasswordEncryptor.ENCRYPTION_KEY));
    }

}