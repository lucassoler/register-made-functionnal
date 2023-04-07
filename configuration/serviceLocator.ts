import {
    encryptUserPassword, identifyUser,
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
import {getDataSource} from "./typeorm/connection";
import {DataSource} from "typeorm";
import {UuidGenerator} from "../identityAndAccess/writes/domain/ports/uuidGenerator";
import {CryptoUuidGenerator} from "../identityAndAccess/writes/infrastructure/cryptoUuidGenerator";

export interface Dependencies {
    userRepository: UserRepository,
    passwordEncryptor: PasswordEncryptorService,
    uuidGenerator: UuidGenerator,
    logger: Logger,
    dataSource: DataSource
}

export const serviceLocator = (): Dependencies => {
    const environmentVariables = new NodeEnvironmentVariables();
    const logger = new WinstonLogger(environmentVariables);
    const dataSource = getDataSource(environmentVariables);

    return {
        passwordEncryptor: new FakePasswordEncryptor(),
        userRepository : new UserRepositoryInMemory(),
        uuidGenerator : new CryptoUuidGenerator(),
        logger,
        dataSource
    }
}

export interface Workflows {
    register: RegisterWorkflow,
    mapDomainError: MapDomainError
}

export const workflows = (dependencies: Dependencies): Workflows =>  {
    return {
        register: register(encryptUserPassword(dependencies.passwordEncryptor), identifyUser(dependencies.uuidGenerator), saveUser(dependencies.userRepository)),
        mapDomainError: ExpressUtils.domainErrorHandling(dependencies.logger)
    }

}