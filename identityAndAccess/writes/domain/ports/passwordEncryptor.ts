import {EncryptedPassword, Password} from "../register.types";
import {EitherAsync} from "purify-ts";
import {EncryptUserError} from "../register.errors";

export interface PasswordEncryptorService {
    encrypt(password: Password): EitherAsync<EncryptUserError, EncryptedPassword>
}