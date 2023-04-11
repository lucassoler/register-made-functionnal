import {ISendEmailToCustomer} from "../domain/ports/ISendEmailToCustomer";
import {Email} from "../domain/register.types";
import {SendWelcomeEmailTypes} from "../domain/send-welcome-email.types";
import {SendWelcomeEmailErrors} from "../domain/send-welcome-email.errors";
import * as TE from 'fp-ts/TaskEither';

export class FakeEmailSender implements ISendEmailToCustomer {
    private emailsSent: Email[] = [];
    private errorToThrow: SendWelcomeEmailErrors | null = null;

    sendEmail(email: Email): TE.TaskEither<SendWelcomeEmailErrors, SendWelcomeEmailTypes> {
        this.emailsSent.push(email);
        return this.errorToThrow ? TE.left(this.errorToThrow) : TE.right(new SendWelcomeEmailTypes());
    }

    hasSentEmailTo(email: Email): boolean {
        return this.emailsSent.includes(email);
    }

    throwError(sendWelcomeEmailError: SendWelcomeEmailErrors) {
        this.errorToThrow = sendWelcomeEmailError;
    }
}