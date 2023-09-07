import {isRight, right} from "fp-ts/Either";
import {UserRepositoryInMemory} from "../../writes/infrastructure/userRepositoryInMemory";
import {checkError} from "../helpers/checkError";
import {requestResetPassword} from "../../writes/workflows/requestResetPassword/request-reset-password.workflow";
import {
    ResetPasswordFlowInitiated,
    UnvalidatedResetPasswordRequest
} from "../../writes/domain/request-reset-password.types";
import {EmailDoesNotExists, SendResetPasswordEmailError} from "../../writes/domain/request-reset-password.errors";
import {FakeResetPasswordTokenGenerator} from "../../writes/infrastructure/fakeResetPasswordTokenGenerator";
import {
    RequestResetPasswordRepositoryInMemory
} from "../../writes/infrastructure/requestResetPasswordRepositoryInMemory";
import {FakeEmailSender} from "../../writes/infrastructure/fake-email.sender";
import {An} from "../builders/An";
import {beforeEach, describe, expect, test} from 'vitest';

describe('Request reset password', () => {
    let userRepository: UserRepositoryInMemory;
    let requestResetPasswordRepository: RequestResetPasswordRepositoryInMemory;
    let requestResetPasswordTokenGenerator: FakeResetPasswordTokenGenerator;
    let emailSender: FakeEmailSender;

    beforeEach(() => {
        requestResetPasswordRepository = new RequestResetPasswordRepositoryInMemory();
        requestResetPasswordTokenGenerator = new FakeResetPasswordTokenGenerator();
        userRepository = new UserRepositoryInMemory();
        userRepository.populate(An.ExistingUser().withEmail("jane.doe@gmail.com").build());
        emailSender = new FakeEmailSender();
    });

    test('should initiate a reset password flow', async () => {
        const result = await resetPassword({email: 'jane.doe@gmail.com'});
        expect(isRight(result)).toBeTruthy();
        expect(result).toEqual(right(new ResetPasswordFlowInitiated("jane.doe@gmail.com")));
    });

    test('should generate a reset password token', async () => {
        const tokenGenerated = '12345';
        requestResetPasswordTokenGenerator.nextToken(tokenGenerated);
        await resetPassword({email: 'jane.doe@gmail.com'});
        expect(requestResetPasswordRepository.shouldHaveStore(tokenGenerated)).toBeTruthy();
    });

    test('should send an email to the user containing the reset password token', async () => {
        const tokenGenerated = '12345';
        requestResetPasswordTokenGenerator.nextToken(tokenGenerated);
        await resetPassword({email: 'jane.doe@gmail.com'});
        expect(emailSender.hasSentResetPasswordEmailTo('jane.doe@gmail.com', tokenGenerated)).toBeTruthy();
    });

    describe('should returns an error', () => {
        test('when email corresponds to no user', async () => {
            const result = await resetPassword({email: 'john.doe@gmail.com'});
            checkError(result, new EmailDoesNotExists('john.doe@gmail.com'));
        });

        test('when email sending fails', async () => {
            emailSender.throwError(new SendResetPasswordEmailError());
            const result = await resetPassword({email: 'jane.doe@gmail.com'});
            checkError(result, new SendResetPasswordEmailError());
        });
    });

    function resetPassword(request: UnvalidatedResetPasswordRequest) {
        return prepareWorkflow()(request)();
    }

    function prepareWorkflow() {
        return requestResetPassword(requestResetPasswordRepository, requestResetPasswordTokenGenerator, userRepository, emailSender);
    }
});