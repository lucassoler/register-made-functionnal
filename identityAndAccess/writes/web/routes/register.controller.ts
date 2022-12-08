import {Request, Response} from 'express';
import {checkSchema, ValidationChain} from 'express-validator';
import { registerUserSchema } from './schema/register.schema';
import {Workflows} from "../../../../configuration/serviceLocator";

export const registerUserValidator = (): ValidationChain[] => {
    return checkSchema(registerUserSchema());
}

export const registerController = (workflows: Workflows) => {
    return async (request: Request, response: Response) => {
        (await workflows.register({ email: request.body.email, password: request.body.password }).run())
            .map(() => response.status(200).json({}))
            .mapLeft(error => workflows.mapDomainError(error, response));
    }
}