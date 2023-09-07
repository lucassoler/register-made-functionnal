import {UserRepository} from "../../domain/ports/userRepository";
import {pipe} from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import {matchE} from "fp-ts/TaskOption";
import {
    RequestResetPasswordErrors,
    ResetPasswordFlowInitiated,
    ResetPasswordRequest,
    UnvalidatedResetPasswordRequest,
    ValidatedResetPasswordRequest
} from "../../domain/request-reset-password.types";
import {IGenerateResetPasswordToken} from "../../domain/ports/IGenerateResetPasswordToken";
import {IStoreResetPasswordTokens} from "../../domain/ports/IStoreResetPasswordTokens";
import {EmailDoesNotExists} from "../../domain/request-reset-password.errors";
import {ISendEmailToCustomer} from "../../domain/ports/ISendEmailToCustomer";

export type RequestResetPasswordWorkflow = (request: UnvalidatedResetPasswordRequest) => TE.TaskEither<RequestResetPasswordErrors, ResetPasswordFlowInitiated>;

export const requestResetPassword = (
    repository: IStoreResetPasswordTokens,
    tokenGenerator: IGenerateResetPasswordToken,
    userRepository: UserRepository,
    emailSender: ISendEmailToCustomer): RequestResetPasswordWorkflow =>
    (request: UnvalidatedResetPasswordRequest) =>
        pipe(
            checkUserEmailExists(userRepository)(request),
            TE.chain(generateToken(tokenGenerator)),
            TE.chain(storeToken(repository)),
            TE.chain(sendResetPasswordEmail(emailSender)),
            TE.chain((request) => TE.right(new ResetPasswordFlowInitiated(request.email)))
        )

const checkUserEmailExists = (userRepository: UserRepository) =>
    (request: UnvalidatedResetPasswordRequest): TE.TaskEither<RequestResetPasswordErrors, ValidatedResetPasswordRequest> =>
        pipe(
            userRepository.findByEmail(request.email),
            matchE(
                () => TE.left(new EmailDoesNotExists(request.email)),
                () => TE.right(request)
            ),
        )

const generateToken = (tokenGenerator: IGenerateResetPasswordToken) =>
    (request: ValidatedResetPasswordRequest): TE.TaskEither<RequestResetPasswordErrors, ResetPasswordRequest> => TE.right({
        ...request,
        token: tokenGenerator.generate()
    })

const storeToken = (repository: IStoreResetPasswordTokens) => (request: ResetPasswordRequest) => repository.storeResetPasswordToken(request)

const sendResetPasswordEmail = (emailSender: ISendEmailToCustomer) => (request: ResetPasswordRequest) => emailSender.sendResetPasswordEmail(request);
