import {ISendEmailToCustomer} from "../../domain/ports/ISendEmailToCustomer";
import {UserRegister} from "../../domain/register.types";
import {EitherAsync} from "purify-ts";
import {SendWelcomeEmailErrors} from "../../domain/send-welcome-email.errors";
import {SendWelcomeEmailTypes} from "../../domain/send-welcome-email.types";

export type SendWelcomeEmailWorkflow = (userRegisterEvent: UserRegister) => EitherAsync<SendWelcomeEmailErrors, SendWelcomeEmailTypes>;

export const sendEmailToCustomer = (emailSender: ISendEmailToCustomer): SendWelcomeEmailWorkflow =>
    (userRegisterEvent: UserRegister): EitherAsync<SendWelcomeEmailErrors, SendWelcomeEmailTypes> => emailSender.sendEmail(userRegisterEvent.email)