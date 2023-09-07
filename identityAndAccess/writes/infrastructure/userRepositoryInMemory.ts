import * as TE from 'fp-ts/lib/TaskEither';
import {Email, EncryptedUser, User} from '../domain/register.types';
import {EmailAlreadyUsed} from '../domain/register.errors';
import {UserRepository} from "../domain/ports/userRepository";
import {fromNullable, TaskOption} from "fp-ts/TaskOption";

export class UserRepositoryInMemory implements UserRepository {
    private readonly persistedUsers: User[] = [];

    persistUser(user: User): TE.TaskEither<EmailAlreadyUsed, User> {
        const existingUser = this.persistedUsers.find(u => u.email === user.email);
        if (existingUser) {
            return TE.left(new EmailAlreadyUsed(user.email));
        }
        this.persistedUsers.push(user);
        return TE.right(user);
    }

    findByEmail(email: Email): TaskOption<User> {
        const user = this.persistedUsers.find(user => user.email === email) || null;
        return fromNullable(user);
    }

    findByEmail2(email: Email): EncryptedUser {
        const user = this.persistedUsers.find(user => user.email === email);
        if (!user) throw new Error('User not found');
        return user;
    }

    populate(unvalidatedUser: User) {
        this.persistedUsers.push(unvalidatedUser);
    }
}