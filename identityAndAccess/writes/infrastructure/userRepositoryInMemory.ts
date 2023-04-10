import * as TE from 'fp-ts/lib/TaskEither';
import { Email, EncryptedUser, User } from '../domain/register.types';
import { EmailAlreadyUsed } from '../domain/register.errors';
import {UserRepository} from "../workflows/register/registed.fp-ts";

export class UserRepositoryInMemory implements UserRepository {
    private readonly persistedUsers: EncryptedUser[] = [];

    persistUser(user: User): TE.TaskEither<EmailAlreadyUsed, User> {
        const existingUser = this.persistedUsers.find(u => u.email === user.email);
        if (existingUser) {
            return TE.left(new EmailAlreadyUsed(user.email));
        }
        this.persistedUsers.push(user);
        return TE.right(user);
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