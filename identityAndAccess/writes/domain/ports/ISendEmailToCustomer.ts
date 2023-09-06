import {Email} from "../register.types";
import {SendWelcomeEmailErrors} from "../send-welcome-email.errors";
import * as TE from 'fp-ts/TaskEither';

export interface ISendEmailToCustomer {
    sendEmail(email: Email): TE.TaskEither<SendWelcomeEmailErrors, Email>;
}