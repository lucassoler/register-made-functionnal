export default class IdentityErrorCodes {
    static readonly EmailInvalid = IdentityErrorCodes.concatErrorCode("4000");
    static readonly EmailAlreadyUsed = IdentityErrorCodes.concatErrorCode("4001");
    static readonly PasswordInvalid = IdentityErrorCodes.concatErrorCode("4002");
    static readonly PasswordShouldHaveAMinimumLength = IdentityErrorCodes.concatErrorCode("4003");
    static readonly InvalidUser = IdentityErrorCodes.concatErrorCode("4004");
    static readonly EncryptionServiceError = IdentityErrorCodes.concatErrorCode("4005");
    static readonly PasswordShouldContainsSpecialCharacters = IdentityErrorCodes.concatErrorCode("4006");
    static readonly PersistUserError = IdentityErrorCodes.concatErrorCode("4007");
    static readonly SendWelcomeEmailError = IdentityErrorCodes.concatErrorCode("4008");
    static readonly PersistResetPasswordTokenError = IdentityErrorCodes.concatErrorCode("4009");
    private static readonly IDENTITY_ERROR_CODE = "IDENTITY_ERR_";

    private static concatErrorCode(error: string) {
        return IdentityErrorCodes.IDENTITY_ERROR_CODE + error;
    }
}