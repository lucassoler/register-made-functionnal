import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import createError, {HttpError} from "http-errors";
import {DomainError} from "../sharedKernel/domain/domainError";
import {Logger} from "../sharedKernel/services/logger";
import {ExpressUtils} from "./expressUtils";

export class ExpressMiddlewares {

    static preErrorHandling() {
        return (request: Request, response: Response, next: NextFunction): void => {
            const errors = validationResult(request);

            if (!errors.isEmpty()) {
                let httpError = new createError.BadRequest();

                response.status(httpError.status).send({
                    status_code: httpError.status,
                    error_name: httpError.name.replace("Error", ""),
                    errors: errors.array().map(e => {
                        return {
                            param: e.param,
                            message: e.msg
                        };
                    })
                });
            } else {
                next();
            }
        }
    }

    static notCatchedExceptions(logger: Logger) {
        return (error: DomainError, request: Request, response: Response, next: NextFunction): Response => {
            let httpError: HttpError = new createError.InternalServerError("Internal Server Error");

            logger.error("Not Catched Exception : error while processing the request", {
                code: error.code,
                custom_message: error.message,
                http_status_code: httpError.statusCode.toString()
            })

            const responseBody: CustomErrorResponse = {
                status_code: httpError.statusCode,
                error_code: error.code || null,
                error_name: httpError.name.replace('Error', ''),
                message: httpError.message
            };
            return response.status(httpError.statusCode).send(responseBody);
        }
    }
}

export type CustomErrorInnerErrorResponse = { code: string, message: string, errors?: Array<CustomErrorInnerErrorResponse> };
export type CustomErrorResponse = {
    status_code: number,
    error_code: string | null,
    error_name: string,
    message: string,
    errors?: Array<CustomErrorInnerErrorResponse>
}