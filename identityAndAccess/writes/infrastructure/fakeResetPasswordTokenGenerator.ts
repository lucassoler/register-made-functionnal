import {IGenerateResetPasswordToken} from "../domain/ports/IGenerateResetPasswordToken";
import {ResetPasswordToken} from "../domain/request-reset-password.types";

export class FakeResetPasswordTokenGenerator implements IGenerateResetPasswordToken {
    private nextTokenToReturn: ResetPasswordToken = '';

    nextToken(tokenGenerated: ResetPasswordToken) {
        this.nextTokenToReturn = tokenGenerated;
    }

    generate(): string {
        return this.nextTokenToReturn;
    }
}