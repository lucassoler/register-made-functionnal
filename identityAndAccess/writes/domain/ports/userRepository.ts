import {EncryptedUser, User} from "../register.types";
import {EitherAsync} from "purify-ts";
import {EmailAlreadyUsed} from "../register.errors";


export interface UserRepository {
    persistUser(user: User): EitherAsync<EmailAlreadyUsed, User>;
}