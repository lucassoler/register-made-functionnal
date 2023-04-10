import * as TE from 'fp-ts/TaskEither';
import {pipe} from 'fp-ts/function';
import {Task} from 'fp-ts/lib/Task';
import {
    EncryptedUser,
    RegisterErrors,
    RegisterEvents,
    UnvalidatedUser,
    User, UserRegister,
    ValidatedUser
} from "../../domain/register.types";
import {checkUserToRegister} from "./checkUserToRegister";
import {PasswordEncryptorService} from "../../domain/ports/passwordEncryptor";
import {EmailAlreadyUsed} from "../../domain/register.errors";
import {TaskEither} from "fp-ts/TaskEither";

export type RegisterWorkflow = (user: UnvalidatedUser) => TE.TaskEither<RegisterErrors, RegisterEvents>;

export const registerFpTs: (
    encryptUser: EncryptUserPassword,
    identifyUser: IdentifyUser,
    saveUser: SaveUser
) => RegisterWorkflow = (encryptUser, identifyUser, saveUser) => (user) =>
    pipe(
        TE.right(user),
        TE.chain(checkUser),
        TE.chain(encryptUser),
        TE.chain(identifyUser),
        TE.chain(saveUser),
        TE.map(createRegisterEvents)
    );

const checkUser = (user: UnvalidatedUser): TaskEither<RegisterErrors, ValidatedUser> => pipe(checkUserToRegister(user), TE.fromEither)
type IdentifyUser = (encryptedUser: EncryptedUser) => TaskEither<RegisterErrors, User>;

export interface UuidGenerator {
    generate(): Task<string>;
}

export const identifyUser: (uuidGenerator: UuidGenerator) => IdentifyUser = (uuidGenerator) => (user): TaskEither<RegisterErrors, User> =>
    pipe(
        uuidGenerator.generate(),
        TE.fromTask,
        TE.map((uuid) => ({...user, id: uuid})),
    );
type EncryptUserPassword = (validatedUser: ValidatedUser) => TE.TaskEither<RegisterErrors, EncryptedUser>;

export const encryptUserPassword: (encryptPasswordService: PasswordEncryptorService) => EncryptUserPassword = (
    encryptPasswordService
) => (validatedUser) =>
    pipe(
        encryptPasswordService.encrypt(validatedUser.password),
        TE.map((encryptedPassword) => ({...validatedUser, password: encryptedPassword})),
    );

type SaveUser = (user: User) => TaskEither<EmailAlreadyUsed, User>;

export interface UserRepository {
    persistUser(user: User): TaskEither<EmailAlreadyUsed, User>;
}

export const saveUser: (userRepository: UserRepository) => SaveUser = (userRepository) => (user) => pipe(
    user,
    userRepository.persistUser
);

const createRegisterEvents = (user: User): TE.TaskEither<RegisterErrors, RegisterEvents> =>
    TE.right(new UserRegister(user.id, user.email));