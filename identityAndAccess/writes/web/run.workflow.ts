import * as TE from "fp-ts/TaskEither";
import {TaskEither} from "fp-ts/TaskEither";
import {DomainError} from "../../../sharedKernel/domain/domainError";
import {DomainEvent} from "../../../sharedKernel/domain/domainEvent";
import {Workflows} from "../../../configuration/serviceLocator";
import {Response} from "express";
import {pipe} from "fp-ts/function";

export async function runWorkflow(workflow: TaskEither<DomainError, DomainEvent>, workflows: Workflows, response: Response<any, Record<string, any>>) {
    await pipe(
        workflow,
        TE.map((events) => workflows.domainEventsPublisher.publish(events)),
        TE.map(() => response.status(200).json({})),
        TE.mapLeft(error => workflows.mapDomainError(error, response))
    )();
}