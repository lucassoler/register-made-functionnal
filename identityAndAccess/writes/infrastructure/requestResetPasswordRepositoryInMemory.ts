import {IStoreResetPasswordTokens} from "../domain/ports/IStoreResetPasswordTokens";
import {
    RequestResetPasswordErrors,
    ResetPasswordRequest,
    ResetPasswordToken
} from "../domain/request-reset-password.types";
import * as TE from "fp-ts/TaskEither";

export class RequestResetPasswordRepositoryInMemory implements IStoreResetPasswordTokens {
    private readonly tokens: ResetPasswordToken[] = [];

    storeResetPasswordToken(request: ResetPasswordRequest): TE.TaskEither<RequestResetPasswordErrors, ResetPasswordRequest> {
        this.tokens.push(request.token);
        return TE.right(request);
    }

    shouldHaveStore(token: ResetPasswordToken) {
        return this.tokens.includes(token);
    }
}