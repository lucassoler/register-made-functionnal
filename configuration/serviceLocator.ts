
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
import {
    sendEmailToCustomer,
    SendWelcomeEmailWorkflow
} from "../identityAndAccess/writes/workflows/sendWelcomeEmail/send-welcome-email.workflow";
import {ISendEmailToCustomer} from "../identityAndAccess/writes/domain/ports/ISendEmailToCustomer";
import {FakeEmailSender} from "../identityAndAccess/writes/infrastructure/fake-email.sender";
import {DomainEvent} from "../sharedKernel/domain/domainEvent";
import {
    encryptUserPassword, identifyUser,
    register,
    RegisterWorkflow, saveUser
} from "../identityAndAccess/writes/workflows/register/register";
import {UserRepositoryTypeOrm} from "../identityAndAccess/writes/infrastructure/userRepositoryTypeOrm";

export interface Dependencies {
    userRepository: UserRepository,
    passwordEncryptor: PasswordEncryptorService,
    uuidGenerator: UuidGenerator,
    emailSender: ISendEmailToCustomer,
    logger: Logger,
    dataSource: DataSource
}

export const serviceLocator = (): Dependencies => {
    const environmentVariables = new NodeEnvironmentVariables();
    const logger = new WinstonLogger(environmentVariables);
    const dataSource = getDataSource(environmentVariables);

    return {
        passwordEncryptor: new FakePasswordEncryptor(),
        userRepository : new UserRepositoryTypeOrm(dataSource),
        uuidGenerator : new CryptoUuidGenerator(),
        emailSender: new FakeEmailSender(),
        logger,
        dataSource
    }
}

export interface Workflows {
    register: RegisterWorkflow,
    sendWelcomeEmail: SendWelcomeEmailWorkflow,
    mapDomainError: MapDomainError,
    domainEventsPublisher: DomainEventPublisher
}

export const workflows = (dependencies: Dependencies): Workflows =>  {
    return {
        register: register(encryptUserPassword(dependencies.passwordEncryptor), identifyUser(dependencies.uuidGenerator), saveUser(dependencies.userRepository)),
        sendWelcomeEmail: sendEmailToCustomer(dependencies.emailSender),
        mapDomainError: ExpressUtils.domainErrorHandling(dependencies.logger),
        domainEventsPublisher: new DomainEventPublisher()
    }
}

class DomainEventPublisher {
    publish(domainEvent: DomainEvent): Promise<void> {
        return Promise.resolve();
    }
}