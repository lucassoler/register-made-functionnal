import {Request, Response} from 'express';
import {checkSchema, ValidationChain} from 'express-validator';
import { registerUserSchema } from './schema/register.schema';
import {Workflows} from "../../../../configuration/serviceLocator";
import {Right} from "purify-ts";

export const registerUserValidator = (): ValidationChain[] => checkSchema(registerUserSchema());

export type ControllerResponse<T> = (request: Request, response: Response) => Promise<T>;

export const registerController = (workflows: Workflows): ControllerResponse<void> =>
    async (request: Request, response: Response) => {
        (await workflows.register({email: request.body.email, password: request.body.password}).run())
            .map(() => response.status(200).json({}))
            .chain((events) => {
                workflows.domainEventsPublisher.publish(events);
                return Right(events)
            })
            .mapLeft(error => workflows.mapDomainError(error, response))
    }