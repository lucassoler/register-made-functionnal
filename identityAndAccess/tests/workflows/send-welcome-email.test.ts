import {UserRegister} from "../../writes/domain/register.types";
import {FakeEmailSender} from "../../writes/infrastructure/fake-email.sender";
import {SendWelcomeEmailTypes} from "../../writes/domain/send-welcome-email.types";
import {SendWelcomeEmailErrors} from "../../writes/domain/send-welcome-email.errors";
import {sendEmailToCustomer} from "../../writes/workflows/sendWelcomeEmail/send-welcome-email.workflow";
import * as E from "fp-ts/Either";

describe("send welcome email on register", () => {
    let fakeEmailSender: FakeEmailSender;

    beforeEach(() => {
        fakeEmailSender = new FakeEmailSender();
    });

    test("should returns a welcome email sent event", async () => {
        const result = await runWorkflow();
        expect(E.isRight(result)).toBeTruthy();
        expect(result).toEqual(E.right(new SendWelcomeEmailTypes()));
    });

    test("should send a welcome email", async () => {
        await runWorkflow("my-email@test.com");
        expect(fakeEmailSender.hasSentEmailTo("my-email@test.com")).toBeTruthy();
    });

    test("should returns an error if email sender fails", async () => {
        const sendWelcomeEmailErrors = new SendWelcomeEmailErrors();
        fakeEmailSender.throwError(sendWelcomeEmailErrors);
        const result = await runWorkflow();
        expect(E.isLeft(result)).toBeTruthy();
        expect(result).toEqual(E.left(sendWelcomeEmailErrors));
    });

    function prepareWorkflow() {
        return sendEmailToCustomer(fakeEmailSender);
    }

    async function runWorkflow(email: string = "my-test@email.com") {
        const workflow = prepareWorkflow();
        return await workflow(new UserRegister("cfd951d4-cb21-4969-af9e-79a518297a57", email))();
    }
});

