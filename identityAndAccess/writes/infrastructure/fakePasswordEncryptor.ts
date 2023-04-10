import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { EncryptedPassword, Password } from '../domain/register.types';
import { PasswordEncryptorService } from '../domain/ports/passwordEncryptor';
import { EncryptUserError } from '../domain/register.errors';

export class FakePasswordEncryptor implements PasswordEncryptorService {
    static ENCRYPTION_KEY = '_ENCRYPTED';

    encrypt(
        password: Password
    ): TE.TaskEither<EncryptUserError, EncryptedPassword> {
        return pipe(
            () => Promise.resolve(password + FakePasswordEncryptor.ENCRYPTION_KEY),
            TE.fromTask,
        );
    }
}