import {Request, Response} from 'express';
import {checkSchema, ValidationChain} from 'express-validator';
import {requestResetPasswordSchema} from './schema/register.schema';
import {Workflows} from "../../../../configuration/serviceLocator";
import {runWorkflow} from "../run.workflow";

export const requestResetPasswordValidator = (): ValidationChain[] => checkSchema(requestResetPasswordSchema());

export type ControllerResponse<T> = (request: Request, response: Response) => Promise<T>;

export const requestResetPasswordController = (workflows: Workflows): ControllerResponse<void> =>
    async (request: Request, response: Response) => {
        await runWorkflow(workflows.requestResetPassword({email: request.body.email}), workflows, response);
    }