import {
    encryptUserPassword,
    register,
    RegisterWorkflow,
    saveUser
} from "../identityAndAccess/writes/workflows/register/register";
import {FakePasswordEncryptor} from "../identityAndAccess/writes/infrastructure/fakePasswordEncryptor";
import {UserRepositoryInMemory} from "../identityAndAccess/writes/infrastructure/userRepositoryInMemory";
import {UserRepository} from "../identityAndAccess/writes/domain/ports/userRepository";
import {PasswordEncryptorService} from "../identityAndAccess/writes/domain/ports/passwordEncryptor";
import {Logger, WinstonLogger} from "../sharedKernel/services/logger";
import {NodeEnvironmentVariables} from "./environment/environmentVariables";
import {ExpressUtils, MapDomainError} from "../web/expressUtils";

export interface Dependencies {
    userRepository: UserRepository,
    passwordEncryptor: PasswordEncryptorService,
    logger: Logger
}

export const serviceLocator = (): Dependencies => {
    const environmentVariables = new NodeEnvironmentVariables();
    const logger = new WinstonLogger(environmentVariables);

    return {
        passwordEncryptor: new FakePasswordEncryptor(),
        userRepository : new UserRepositoryInMemory(),
        logger
    }
}

export interface Workflows {
    register: RegisterWorkflow,
    mapDomainError: MapDomainError
}

export const workflows = (dependencies: Dependencies): Workflows =>  {
    return {
        register: register(encryptUserPassword(dependencies.passwordEncryptor), saveUser(dependencies.userRepository)),
        mapDomainError: ExpressUtils.domainErrorHandling(dependencies.logger)
    }

}