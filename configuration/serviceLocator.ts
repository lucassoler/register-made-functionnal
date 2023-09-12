import {FakePasswordEncryptor} from "../identityAndAccess/writes/infrastructure/fakePasswordEncryptor";
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
    encryptUserPassword,
    identifyUser,
    register,
    RegisterWorkflow,
    saveUser
} from "../identityAndAccess/writes/workflows/register/register";
import {UserRepositoryTypeOrm} from "../identityAndAccess/writes/infrastructure/userRepositoryTypeOrm";
import {
    requestResetPassword,
    RequestResetPasswordWorkflow
} from "../identityAndAccess/writes/workflows/requestResetPassword/request-reset-password.workflow";
import {
    RequestResetPasswordRepositoryInMemory
} from "../identityAndAccess/writes/infrastructure/requestResetPasswordRepositoryInMemory";
import {IStoreResetPasswordTokens} from "../identityAndAccess/writes/domain/ports/IStoreResetPasswordTokens";
import {IGenerateResetPasswordToken} from "../identityAndAccess/writes/domain/ports/IGenerateResetPasswordToken";
import {
    FakeResetPasswordTokenGenerator
} from "../identityAndAccess/writes/infrastructure/fakeResetPasswordTokenGenerator";

export interface Dependencies {
    userRepository: UserRepository,
    tokenGenerator: IGenerateResetPasswordToken,
    requestResetPasswordRepository: IStoreResetPasswordTokens,
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
        requestResetPasswordRepository: new RequestResetPasswordRepositoryInMemory(),
        tokenGenerator: new FakeResetPasswordTokenGenerator(),
        userRepository: new UserRepositoryTypeOrm(dataSource),
        uuidGenerator: new CryptoUuidGenerator(),
        emailSender: new FakeEmailSender(),
        logger,
        dataSource
    }
}

export interface Workflows {
    register: RegisterWorkflow,
    sendWelcomeEmail: SendWelcomeEmailWorkflow,
    requestResetPassword: RequestResetPasswordWorkflow,
    mapDomainError: MapDomainError,
    domainEventsPublisher: DomainEventPublisher,
}

export const workflows = (dependencies: Dependencies): Workflows => {
    return {
        register: register(encryptUserPassword(dependencies.passwordEncryptor), identifyUser(dependencies.uuidGenerator), saveUser(dependencies.userRepository)),
        requestResetPassword: requestResetPassword(dependencies.requestResetPasswordRepository, dependencies.tokenGenerator, dependencies.userRepository, dependencies.emailSender),
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