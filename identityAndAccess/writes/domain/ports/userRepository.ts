import {User} from "../register.types";
import {EmailAlreadyUsed} from "../register.errors";
import {TaskEither} from "fp-ts/TaskEither";



export interface UserRepository {
    persistUser(user: User): TaskEither<EmailAlreadyUsed, User>;
}