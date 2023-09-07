import {Email} from "../register.types";
import {SendWelcomeEmailErrors} from "../send-welcome-email.errors";
import * as TE from 'fp-ts/TaskEither';
import {ResetPasswordRequest} from "../request-reset-password.types";
import {SendResetPasswordEmailErrors} from "../send-reset-password-email.error";

export interface ISendEmailToCustomer {
    sendEmail(email: Email): TE.TaskEither<SendWelcomeEmailErrors, Email>;

    sendResetPasswordEmail(request: ResetPasswordRequest): TE.TaskEither<SendResetPasswordEmailErrors, ResetPasswordRequest>;
}