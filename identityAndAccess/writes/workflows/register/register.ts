import * as TE from 'fp-ts/TaskEither';
import {pipe} from 'fp-ts/function';
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
import {UserRepository} from "../../domain/ports/userRepository";
import {UuidGenerator} from "../../domain/ports/uuidGenerator";

export type RegisterWorkflow = (user: UnvalidatedUser) => TE.TaskEither<RegisterErrors, RegisterEvents>;

export const register: (
    encryptUser: EncryptUserPassword,
    identifyUser: IdentifyUser,
    saveUser: SaveUser
) => RegisterWorkflow = (encryptUser, addIdentifierOnUser, saveUser) =>
    (user) =>
        pipe(
            checkUser(user),
            TE.chain(encryptUser),
            TE.chain(addIdentifierOnUser),
            TE.chain(saveUser),
            TE.chain(createRegisterEvents)
        );

const checkUser = (user: UnvalidatedUser): TaskEither<RegisterErrors, ValidatedUser> =>
    pipe(checkUserToRegister(user), TE.fromEither)
type IdentifyUser = (encryptedUser: EncryptedUser) => TaskEither<RegisterErrors, User>;

export const identifyUser: (uuidGenerator: UuidGenerator) =>
    IdentifyUser = (uuidGenerator) =>
    (user): TaskEither<RegisterErrors, User> =>
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

export const saveUser: (userRepository: UserRepository) => SaveUser = (userRepository) =>
    (user) =>
        userRepository.persistUser(user);

const createRegisterEvents = (user: User): TE.TaskEither<RegisterErrors, RegisterEvents> =>
    TE.right(new UserRegister(user.id, user.email));