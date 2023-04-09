import {Email} from "../register.types";
import {EitherAsync} from "purify-ts";
import {SendWelcomeEmailTypes} from "../send-welcome-email.types";
import {SendWelcomeEmailErrors} from "../send-welcome-email.errors";

export interface ISendEmailToCustomer {
    sendEmail(email: Email): EitherAsync<SendWelcomeEmailErrors, SendWelcomeEmailTypes>;
}