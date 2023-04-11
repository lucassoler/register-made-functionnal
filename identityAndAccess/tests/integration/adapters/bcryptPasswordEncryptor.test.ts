import {BcryptPasswordEncryptor} from "../../../writes/infrastructure/bcryptPasswordEncryptor";
import * as E from "fp-ts/Either";

describe('bcrypt password encryptor', () => {
    test('should encrypt password', async () => {
        const passwordEncryptor = new BcryptPasswordEncryptor();
        const result = await passwordEncryptor.encrypt('password');
        expect(result).not.toEqual(E.right('password'));
    });
});

