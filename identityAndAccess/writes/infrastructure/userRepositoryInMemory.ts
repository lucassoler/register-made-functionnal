import {Email, EncryptedUser,} from "../domain/register.types";
import {EitherAsync, Just, Left, Maybe, Right} from "purify-ts";
import {UserRepository} from "../domain/ports/userRepository";
import {EmailAlreadyUsed} from "../domain/register.errors";

export class UserRepositoryInMemory implements UserRepository {
    private readonly persistedUsers: EncryptedUser[] = [];

    persistUser(encryptedUser: EncryptedUser): EitherAsync<EmailAlreadyUsed, EncryptedUser> {
        if (this.persistedUsers.find(user => user.email === encryptedUser.email)) {
            return EitherAsync.liftEither(Left(new EmailAlreadyUsed(encryptedUser.email)));
        }
        this.persistedUsers.push(encryptedUser);
        return EitherAsync.liftEither(Right(encryptedUser));
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