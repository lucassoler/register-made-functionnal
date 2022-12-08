import {
    EncryptedUser,
    RegisterErrors,
    RegisterEvents,
    UnvalidatedUser,
    UserRegister,
    ValidatedUser
} from "../../domain/register.types";
import {Either, EitherAsync, Right} from "purify-ts";
import {PasswordEncryptorService} from "../../domain/ports/passwordEncryptor";
import {checkUserToRegister} from "./checkUserToRegister";
import {UserRepository} from "../../domain/ports/userRepository";
import {EmailAlreadyUsed, EncryptionServiceError} from "../../domain/register.errors";


export type RegisterWorkflow = (user: UnvalidatedUser) => EitherAsync<RegisterErrors, RegisterEvents>;
export const register = (encryptUser: EncryptUserPassword, saveUser: SaveUser): RegisterWorkflow => {
    return (user: UnvalidatedUser) => EitherAsync.liftEither(checkUserToRegister(user))
            .chain(validatedUser => encryptUser(validatedUser))
            .chain(encryptedUser => saveUser(encryptedUser))
            .chain(user => EitherAsync.liftEither(createRegisterEvents(user)));
}

type EncryptUserPassword = (validatedUser: ValidatedUser) => EitherAsync<RegisterErrors, EncryptedUser>;
export const encryptUserPassword = (encryptPasswordService: PasswordEncryptorService): EncryptUserPassword => {
    return (validatedUser: ValidatedUser) => encryptPasswordService
        .encrypt(validatedUser.password)
        .map(encryptedPassword => ({...validatedUser, password: encryptedPassword}));
}

type SaveUser = (encryptedUser: EncryptedUser) => EitherAsync<EmailAlreadyUsed, EncryptedUser>;
export const saveUser = (userRepository: UserRepository) : SaveUser => {
    return (encryptedUser: EncryptedUser) => userRepository.persistUser(encryptedUser);
}

const createRegisterEvents = (user: EncryptedUser): Either<EncryptionServiceError, RegisterEvents> => {
    return Right(UserRegister);
}