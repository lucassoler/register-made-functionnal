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

interface IGenerateResetPasswordToken {
    generate(): string;
}

function requestResetPassword(repository: IStoreResetPasswordTokens, tokenGenerator: IGenerateResetPasswordToken): RequestResetPasswordWorkflow {
    return (request: UnvalidatedResetPasswordRequest) => {
        return pipe(
            generateToken(tokenGenerator)(request),
            TE.chain((request) => repository.storeResetPasswordToken(request)),
            TE.chain((request) => TE.right(new RequestPasswordResetSent(request.email)))
        );
    }
}

const generateToken = (tokenGenerator: IGenerateResetPasswordToken) => {
    return (request: UnvalidatedResetPasswordRequest): TE.TaskEither<RequestResetPasswordErrors, ResetPasswordRequest> => {
        return TE.right({...request, token: tokenGenerator.generate()});
    };
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


interface IStoreResetPasswordTokens {
    storeResetPasswordToken(token: ResetPasswordRequest): TE.TaskEither<PersistResetPasswordTokenError, ResetPasswordRequest>;
}

class InMemoryRequestResetPasswordRepository implements IStoreResetPasswordTokens {
    private readonly tokens: ResetPasswordToken[] = [];

    storeResetPasswordToken(request: ResetPasswordRequest): TE.TaskEither<PersistResetPasswordTokenError, ResetPasswordRequest> {
        this.tokens.push(request.token);
        return TE.right(request);
    }

    shouldHaveStore(token: ResetPasswordToken) {
        return this.tokens.includes(token);
    }
}

class FakeResetPasswordTokenGenerator implements IGenerateResetPasswordToken {
    private nextTokenToReturn: ResetPasswordToken = '';

    nextToken(tokenGenerated: ResetPasswordToken) {
        this.nextTokenToReturn = tokenGenerated;
    }

    generate(): string {
        return this.nextTokenToReturn;
    }
}

describe('Request reset password', function () {
    let requestResetPasswordRepository: InMemoryRequestResetPasswordRepository;
    let requestResetPasswordTokenGenerator: FakeResetPasswordTokenGenerator;

    beforeEach(() => {
        requestResetPasswordRepository = new InMemoryRequestResetPasswordRepository();
        requestResetPasswordTokenGenerator = new FakeResetPasswordTokenGenerator();
    });

    test('request a reset password', async () => {
        const result = await resetPassword({email: 'jane.doe@gmail.com'});
        expect(isRight(result)).toBeTruthy();
        expect(result).toEqual(right(new RequestPasswordResetSent("jane.doe@gmail.com")));
    });

    test('should generate a reset password token', async () => {
        const tokenGenerated = '12345';
        requestResetPasswordTokenGenerator.nextToken(tokenGenerated);
        await resetPassword({email: 'jane.doe@gmail.com'});
        expect(requestResetPasswordRepository.shouldHaveStore(tokenGenerated)).toBeTruthy();
    });


    function resetPassword(request: UnvalidatedResetPasswordRequest) {
        return prepareWorkflow()(request)();
    }

    function prepareWorkflow() {
        return requestResetPassword(requestResetPasswordRepository, requestResetPasswordTokenGenerator);
    }
});