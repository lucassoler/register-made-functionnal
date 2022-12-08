import {
    DomainConflictError,
    DomainError,
    DomainNotFoundError,
    DomainValidationError
} from "../sharedKernel/domain/domainError";
import {Response} from "express";
import createError, {HttpError} from "http-errors";
import {CustomErrorInnerErrorResponse, CustomErrorResponse} from "./expressMiddlewares";
import {Logger} from "../sharedKernel/services/logger";

export type MapDomainError = (error: DomainError, response: Response) => Response;

export class ExpressUtils {
    static domainErrorHandling(logger: Logger): MapDomainError {
        return (error: DomainError, response: Response): Response => {
            let httpError: HttpError = new createError.InternalServerError("Internal Server Error");

            if (error instanceof DomainValidationError)
                httpError = new createError.BadRequest(error.message);
            else if (error instanceof DomainNotFoundError)
                httpError = new createError.NotFound(error.message);
            else if (error instanceof DomainConflictError)
                httpError = new createError.Conflict(error.message);

            const responseBody: CustomErrorResponse = {
                status_code: httpError.statusCode,
                error_code: error.code || null,
                error_name: httpError.name.replace('Error', ''),
                message: httpError.message
            };

            if (error.innerExceptions && error.innerExceptions.length > 0) {
                responseBody.errors = this.mapInnerError(error.innerExceptions)
            }

            logger.error("Domain Error Handling: error while processing the request", {
                code: error.code,
                custom_message: error.message,
                http_status_code: httpError.statusCode.toString()
            })

            return response.status(httpError.statusCode).send(responseBody);
        }
    }

    private static mapInnerError(errors: Array<DomainError>): Array<CustomErrorInnerErrorResponse> {
        return errors.map(e => {
            let responseBody: CustomErrorInnerErrorResponse = {
                code: e.code,
                message: e.message
            };

            if (e.innerExceptions && e.innerExceptions.length > 0) {
                responseBody.errors = this.mapInnerError(e.innerExceptions)
            }

            return responseBody;
        });
    }
}