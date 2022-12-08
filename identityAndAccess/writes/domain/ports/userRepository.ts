import {EncryptedUser} from "../register.types";
import {EitherAsync} from "purify-ts";
import {EmailAlreadyUsed} from "../register.errors";


export interface UserRepository {
    persistUser(encryptedUser: EncryptedUser): EitherAsync<EmailAlreadyUsed, EncryptedUser>;
}