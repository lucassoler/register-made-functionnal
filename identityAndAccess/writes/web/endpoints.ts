import {registerController, registerUserValidator} from "./routes/register.controller";
import {Router} from "express";
import {Dependencies, Workflows} from "../../../configuration/serviceLocator";
import asyncHandler from "express-async-handler";
import {ExpressMiddlewares} from "../../../web/expressMiddlewares";

export const identityAndAccessEndpoints= (router: Router, workflows: Workflows): void => {
    router.post('/identity/register', registerUserValidator(), ExpressMiddlewares.preErrorHandling(), asyncHandler(registerController(workflows)));
}