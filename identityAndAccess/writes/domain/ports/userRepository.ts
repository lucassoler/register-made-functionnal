import {Email, User} from "../register.types";
import {EmailAlreadyUsed} from "../register.errors";
import {TaskEither} from "fp-ts/TaskEither";
import {TaskOption} from "fp-ts/TaskOption";


export interface UserRepository {
    persistUser(user: User): TaskEither<EmailAlreadyUsed, User>;

    findByEmail(email: Email): TaskOption<User>;
}