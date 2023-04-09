import {
    EncryptedUser,
    RegisterErrors,
    RegisterEvents,
    UnvalidatedUser, User,
    UserRegister,
    ValidatedUser
} from "../../domain/register.types";
import {EitherAsync,  Right} from "purify-ts";
import {PasswordEncryptorService} from "../../domain/ports/passwordEncryptor";
import {checkUserToRegister} from "./checkUserToRegister";
import {UserRepository} from "../../domain/ports/userRepository";
import {EmailAlreadyUsed, InvalidUser} from "../../domain/register.errors";
import {UuidGenerator} from "../../domain/ports/uuidGenerator";

export type RegisterWorkflow = (user: UnvalidatedUser) => EitherAsync<RegisterErrors, RegisterEvents>;
export const register = (encryptUser: EncryptUserPassword, identifyUser: IdentifyUser, saveUser: SaveUser): RegisterWorkflow =>
    (user: UnvalidatedUser) => EitherAsync.liftEither(checkUserToRegister(user))
        .chain(validatedUser => encryptUser(validatedUser))
        .chain(encryptedUser => identifyUser(encryptedUser))
        .chain(user => saveUser(user))
        .chain(user => createRegisterEvents(user));

type IdentifyUser = (encryptedUser: EncryptedUser) => EitherAsync<RegisterErrors, User>;
export const identifyUser = (uuidGenerator: UuidGenerator): IdentifyUser =>
    (user: EncryptedUser): EitherAsync<RegisterErrors, User> =>
        uuidGenerator.generate().map(uuid => ({
            ...user,
            id: uuid
        })).toEitherAsync(new InvalidUser([]));

type EncryptUserPassword = (validatedUser: ValidatedUser) => EitherAsync<RegisterErrors, EncryptedUser>;
export const encryptUserPassword = (encryptPasswordService: PasswordEncryptorService): EncryptUserPassword =>
    (validatedUser: ValidatedUser) =>
        encryptPasswordService.encrypt(validatedUser.password)
        .map(encryptedPassword => ({...validatedUser, password: encryptedPassword}));

type SaveUser = (user: User) => EitherAsync<EmailAlreadyUsed, User>;
export const saveUser = (userRepository: UserRepository): SaveUser =>
    (user: User) => userRepository.persistUser(user);

const createRegisterEvents = (user: User): EitherAsync<RegisterErrors, RegisterEvents> =>
    EitherAsync.liftEither(Right(new UserRegister(user.id, user.email)));