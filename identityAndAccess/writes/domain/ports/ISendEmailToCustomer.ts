import {Email} from "../register.types";
import {SendWelcomeEmailTypes} from "../send-welcome-email.types";
import {SendWelcomeEmailErrors} from "../send-welcome-email.errors";
import * as TE from 'fp-ts/TaskEither';

export interface ISendEmailToCustomer {
    sendEmail(email: Email): TE.TaskEither<SendWelcomeEmailErrors, SendWelcomeEmailTypes>;
}