import {registerController, registerUserValidator} from "./routes/register.controller";
import {Router} from "express";
import {Workflows} from "../../../configuration/serviceLocator";
import asyncHandler from "express-async-handler";
import {ExpressMiddlewares} from "../../../web/expressMiddlewares";
import {requestResetPasswordController, requestResetPasswordValidator} from "./routes/reset-password.controller";

export const identityAndAccessEndpoints = (router: Router, workflows: Workflows): void => {
    router.post('/identity/register', registerUserValidator(), ExpressMiddlewares.preErrorHandling(), asyncHandler(registerController(workflows)));
    router.post('/identity/reset-password/request', requestResetPasswordValidator(), ExpressMiddlewares.preErrorHandling(), asyncHandler(requestResetPasswordController(workflows)));
}