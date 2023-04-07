import {BcryptPasswordEncryptor} from "../../../writes/infrastructure/bcryptPasswordEncryptor";
import {Right} from "purify-ts";

describe('bcrypt password encryptor', () => {
    test('should encrypt password', () => {
        const passwordEncryptor = new BcryptPasswordEncryptor();
        expect(passwordEncryptor.encrypt('password')).resolves.not.toEqual(Right('password'));
    });
});

