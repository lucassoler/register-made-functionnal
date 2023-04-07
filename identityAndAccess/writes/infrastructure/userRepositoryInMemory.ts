import {Email, EncryptedUser, User,} from "../domain/register.types";
import {EitherAsync, Just, Left, Maybe, Right} from "purify-ts";
import {UserRepository} from "../domain/ports/userRepository";
import {EmailAlreadyUsed} from "../domain/register.errors";

export class UserRepositoryInMemory implements UserRepository {
    private readonly persistedUsers: EncryptedUser[] = [];

    persistUser(user: User): EitherAsync<EmailAlreadyUsed, User> {
        if (this.persistedUsers.find(user => user.email === user.email)) {
            return EitherAsync.liftEither(Left(new EmailAlreadyUsed(user.email)));
        }
        this.persistedUsers.push(user);
        return EitherAsync.liftEither(Right(user));
    }

    findByEmail(email: Email): EncryptedUser {
        const user = this.persistedUsers.find(user => user.email === email);
        if (!user) throw new Error('User not found');
        return user;
    }

    populate(unvalidatedUser: EncryptedUser) {
        this.persistedUsers.push(unvalidatedUser);
    }
}