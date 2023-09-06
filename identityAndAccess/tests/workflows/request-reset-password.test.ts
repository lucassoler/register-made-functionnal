import {Email} from "../../writes/domain/register.types";
import * as TE from "fp-ts/TaskEither";
import {pipe} from "fp-ts/function";
import {DomainServerError} from "../../../sharedKernel/domain/domainError";
import IdentityErrorCodes from "../../writes/domain/identityErrorCodes";
import {DomainEvent} from "../../../sharedKernel/domain/domainEvent";
import {isRight, right} from "fp-ts/Either";

type UnvalidatedResetPasswordRequest = {
    email: Email
}
export type RequestResetPasswordWorkflow = (request: UnvalidatedResetPasswordRequest) => TE.TaskEither<RequestResetPasswordErrors, RequestPasswordResetSent>;
export type RequestResetPasswordErrors = PersistResetPasswordTokenError;


export class RequestPasswordResetSent extends DomainEvent {
    constructor(readonly email: Email) {
        super();
    }
}

function requestResetPassword(repository: IGenerateResetPasswordToken): RequestResetPasswordWorkflow {
    return (request: UnvalidatedResetPasswordRequest) => {
        return pipe(
            repository.storeResetPasswordToken({...request, token: '1234'}),
            TE.chain(() => TE.right(new RequestPasswordResetSent(request.email)))
        );
    }
}

type ResetPasswordToken = string;

type ResetPasswordRequest = UnvalidatedResetPasswordRequest & {
    token: ResetPasswordToken
};

export class PersistResetPasswordTokenError extends DomainServerError {
    readonly code = IdentityErrorCodes.PersistResetPasswordTokenError;

    constructor() {
        super(`Unexpected error`);
    }
}


interface IGenerateResetPasswordToken {
    storeResetPasswordToken(token: ResetPasswordRequest): TE.TaskEither<PersistResetPasswordTokenError, ResetPasswordRequest>;
}

class InMemoryRequestResetPasswordRepository implements IGenerateResetPasswordToken {
    private readonly tokens: ResetPasswordToken[] = [];

    storeResetPasswordToken(request: ResetPasswordRequest): TE.TaskEither<PersistResetPasswordTokenError, ResetPasswordRequest> {
        this.tokens.push(request.token);
        return TE.right(request);
    }

    shouldHaveStore(token: ResetPasswordToken) {
        return this.tokens.includes(token);
    }
}

describe('Request reset password', function () {
    let requestResetPasswordRepository: InMemoryRequestResetPasswordRepository;

    test('request a reset password', async () => {
        const result = await resetPassword({email: 'jane.doe@gmail.com'});
        expect(isRight(result)).toBeTruthy();
        expect(result).toEqual(right(new RequestPasswordResetSent("jane.doe@gmail.com")));
    });

    test('should generate a reset password token', async () => {
        await resetPassword({email: 'jane.doe@gmail.com'});
        expect(requestResetPasswordRepository.shouldHaveStore('1234')).toBeTruthy();
    });


    function resetPassword(request: UnvalidatedResetPasswordRequest) {
        return prepareWorkflow()(request)();
    }

    function prepareWorkflow() {
        requestResetPasswordRepository = new InMemoryRequestResetPasswordRepository();
        return requestResetPassword(requestResetPasswordRepository);
    }
});