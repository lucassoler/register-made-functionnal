import {Request, Response} from 'express';
import {checkSchema, ValidationChain} from 'express-validator';
import {registerUserSchema} from './schema/register.schema';
import {Workflows} from "../../../../configuration/serviceLocator";
import {runWorkflow} from "../run.workflow";

export const registerUserValidator = (): ValidationChain[] => checkSchema(registerUserSchema());

export type ControllerResponse<T> = (request: Request, response: Response) => Promise<T>;

export const registerController = (workflows: Workflows): ControllerResponse<void> =>
    async (request: Request, response: Response) => {
        await runWorkflow(workflows.register({
            email: request.body.email,
            password: request.body.password
        }), workflows, response);
    }