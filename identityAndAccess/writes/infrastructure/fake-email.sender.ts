import {ISendEmailToCustomer} from "../domain/ports/ISendEmailToCustomer";
import {Email} from "../domain/register.types";
import {EitherAsync, Left, Right} from "purify-ts";
import {SendWelcomeEmailTypes} from "../domain/send-welcome-email.types";
import {SendWelcomeEmailErrors} from "../domain/send-welcome-email.errors";

export class FakeEmailSender implements ISendEmailToCustomer {
    private emailsSent: Email[] = [];
    private errorToThrow: SendWelcomeEmailErrors | null = null;

    sendEmail(email: Email): EitherAsync<SendWelcomeEmailErrors, SendWelcomeEmailTypes> {
        this.emailsSent.push(email);
        return this.errorToThrow ? EitherAsync.liftEither(Left(this.errorToThrow)) : EitherAsync.liftEither(Right(new SendWelcomeEmailTypes()));
    }

    hasSentEmailTo(email: Email): boolean {
        return this.emailsSent.includes(email);
    }

    throwError(sendWelcomeEmailError: SendWelcomeEmailErrors) {
        this.errorToThrow = sendWelcomeEmailError;
    }
}