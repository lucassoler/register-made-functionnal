import {Request, Response} from 'express';
import {checkSchema, ValidationChain} from 'express-validator';
import { registerUserSchema } from './schema/register.schema';
import {Workflows} from "../../../../configuration/serviceLocator";
import {Right} from "purify-ts";
import {pipe} from "fp-ts/function";
import {map} from "fp-ts";
import * as TE from "fp-ts/TaskEither";

export const registerUserValidator = (): ValidationChain[] => checkSchema(registerUserSchema());

export type ControllerResponse<T> = (request: Request, response: Response) => Promise<T>;

export const registerController = (workflows: Workflows): ControllerResponse<void> =>
    async (request: Request, response: Response) => {
        await pipe(
            workflows.register({email: request.body.email, password: request.body.password}),
            TE.map((events) => workflows.domainEventsPublisher.publish(events)),
            TE.map(() => response.status(200).json({})),
            TE.mapLeft(error => workflows.mapDomainError(error, response))
        )();
    }