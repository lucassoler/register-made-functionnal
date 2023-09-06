import {ISendEmailToCustomer} from "../../domain/ports/ISendEmailToCustomer";
import {UserRegister} from "../../domain/register.types";
import {SendWelcomeEmailErrors} from "../../domain/send-welcome-email.errors";
import {WelcomeEmailSent} from "../../domain/welcome-email.sent";
import * as TE from 'fp-ts/TaskEither';
import {pipe} from "fp-ts/function";

export type SendWelcomeEmailWorkflow = (userRegisterEvent: UserRegister) => TE.TaskEither<SendWelcomeEmailErrors, WelcomeEmailSent>;

export const sendEmailToCustomer = (emailSender: ISendEmailToCustomer): SendWelcomeEmailWorkflow =>
    (userRegisterEvent: UserRegister): TE.TaskEither<SendWelcomeEmailErrors, WelcomeEmailSent> =>
        pipe(
            emailSender.sendEmail(userRegisterEvent.email),
            TE.map(() => new WelcomeEmailSent())
        );
