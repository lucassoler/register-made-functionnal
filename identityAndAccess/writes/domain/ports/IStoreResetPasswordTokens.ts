import * as TE from "fp-ts/TaskEither";
import {RequestResetPasswordErrors, ResetPasswordRequest} from "../request-reset-password.types";

export interface IStoreResetPasswordTokens {
    storeResetPasswordToken(token: ResetPasswordRequest): TE.TaskEither<RequestResetPasswordErrors, ResetPasswordRequest>;
}