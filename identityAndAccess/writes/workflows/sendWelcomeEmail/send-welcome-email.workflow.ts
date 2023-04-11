import {ISendEmailToCustomer} from "../../domain/ports/ISendEmailToCustomer";
import {UserRegister} from "../../domain/register.types";
import {SendWelcomeEmailErrors} from "../../domain/send-welcome-email.errors";
import {SendWelcomeEmailTypes} from "../../domain/send-welcome-email.types";
import * as TE from 'fp-ts/TaskEither';

export type SendWelcomeEmailWorkflow = (userRegisterEvent: UserRegister) => TE.TaskEither<SendWelcomeEmailErrors, SendWelcomeEmailTypes>;

export const sendEmailToCustomer = (emailSender: ISendEmailToCustomer): SendWelcomeEmailWorkflow =>
    (userRegisterEvent: UserRegister): TE.TaskEither<SendWelcomeEmailErrors, SendWelcomeEmailTypes> =>
        emailSender.sendEmail(userRegisterEvent.email)