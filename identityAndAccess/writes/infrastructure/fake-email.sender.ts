import {ISendEmailToCustomer} from "../domain/ports/ISendEmailToCustomer";
import {Email} from "../domain/register.types";
import {SendWelcomeEmailErrors} from "../domain/send-welcome-email.errors";
import * as TE from 'fp-ts/TaskEither';
import {TaskEither} from 'fp-ts/TaskEither';
import {ResetPasswordRequest} from "../domain/request-reset-password.types";
import {SendResetPasswordEmailErrors} from "../domain/request-reset-password.errors";

export class FakeEmailSender implements ISendEmailToCustomer {
    private welcomeEmailsSent: Email[] = [];
    private resetPasswordEmailSent: ResetPasswordRequest[] = [];
    private errorToThrow: SendWelcomeEmailErrors | SendResetPasswordEmailErrors | null = null;

    sendEmail(email: Email): TE.TaskEither<SendWelcomeEmailErrors, Email> {
        this.welcomeEmailsSent.push(email);
        return this.errorToThrow ? TE.left(this.errorToThrow) : TE.right(email);
    }

    hasSentWelcomeEmailTo(email: Email): boolean {
        return this.welcomeEmailsSent.includes(email);
    }

    throwError(sendWelcomeEmailError: SendWelcomeEmailErrors | SendResetPasswordEmailErrors) {
        this.errorToThrow = sendWelcomeEmailError;
    }

    sendResetPasswordEmail(request: ResetPasswordRequest): TaskEither<SendResetPasswordEmailErrors, ResetPasswordRequest> {
        this.resetPasswordEmailSent.push(request);
        return this.errorToThrow ? TE.left(this.errorToThrow) : TE.right(request);
    }

    hasSentResetPasswordEmailTo(email: string, tokenGenerated: string) {
        return this.resetPasswordEmailSent.some(requestStored => requestStored.email === email && requestStored.token === tokenGenerated);
    }
}