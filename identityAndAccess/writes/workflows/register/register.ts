import {
    EncryptedUser,
    RegisterErrors,
    RegisterEvents,
    UnvalidatedUser, User,
    UserRegister,
    ValidatedUser
} from "../../domain/register.types";
import {Either, EitherAsync, Right} from "purify-ts";
import {PasswordEncryptorService} from "../../domain/ports/passwordEncryptor";
import {checkUserToRegister} from "./checkUserToRegister";
import {UserRepository} from "../../domain/ports/userRepository";
import {EmailAlreadyUsed, EncryptionServiceError} from "../../domain/register.errors";

export type RegisterWorkflow = (user: UnvalidatedUser) => EitherAsync<RegisterErrors, RegisterEvents>;
export const register = (encryptUser: EncryptUserPassword, saveUser: SaveUser): RegisterWorkflow =>
    (user: UnvalidatedUser) => EitherAsync.liftEither(checkUserToRegister(user))
        .chain(validatedUser => encryptUser(validatedUser))
        .chain(encryptedUser => EitherAsync.liftEither(identifyUser(encryptedUser)))
        .chain(user => saveUser(user))
        .chain(user => EitherAsync.liftEither(createRegisterEvents(user)));

export const identifyUser = (user: EncryptedUser): Either<RegisterErrors, User> => Right({
    id: 'f7eafd96-c194-4730-8de6-9da1c330bff3',
    ...user
});

type EncryptUserPassword = (validatedUser: ValidatedUser) => EitherAsync<RegisterErrors, EncryptedUser>;
export const encryptUserPassword = (encryptPasswordService: PasswordEncryptorService): EncryptUserPassword =>
    (validatedUser: ValidatedUser) => encryptPasswordService
        .encrypt(validatedUser.password)
        .map(encryptedPassword => ({...validatedUser, password: encryptedPassword}));

type SaveUser = (user: User) => EitherAsync<EmailAlreadyUsed, EncryptedUser>;
export const saveUser = (userRepository: UserRepository) : SaveUser => (user: User) =>
    userRepository.persistUser(user);

const createRegisterEvents = (user: EncryptedUser): Either<EncryptionServiceError, RegisterEvents> => Right(UserRegister);