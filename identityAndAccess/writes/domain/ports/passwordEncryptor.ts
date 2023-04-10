import {EncryptedPassword, Password} from "../register.types";
import {EitherAsync} from "purify-ts";
import {EncryptUserError} from "../register.errors";
import {TaskEither} from "fp-ts/TaskEither";

export interface PasswordEncryptorService {
    encrypt(password: Password): TaskEither<EncryptUserError, EncryptedPassword>
}