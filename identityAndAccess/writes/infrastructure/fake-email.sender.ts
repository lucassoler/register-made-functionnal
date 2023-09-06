import {ISendEmailToCustomer} from "../domain/ports/ISendEmailToCustomer";
import {Email} from "../domain/register.types";
import {SendWelcomeEmailErrors} from "../domain/send-welcome-email.errors";
import * as TE from 'fp-ts/TaskEither';

export class FakeEmailSender implements ISendEmailToCustomer {
    private emailsSent: Email[] = [];
    private errorToThrow: SendWelcomeEmailErrors | null = null;

    sendEmail(email: Email): TE.TaskEither<SendWelcomeEmailErrors, Email> {
        this.emailsSent.push(email);
        return this.errorToThrow ? TE.left(this.errorToThrow) : TE.right(email);
    }

    hasSentEmailTo(email: Email): boolean {
        return this.emailsSent.includes(email);
    }

    throwError(sendWelcomeEmailError: SendWelcomeEmailErrors) {
        this.errorToThrow = sendWelcomeEmailError;
    }
}