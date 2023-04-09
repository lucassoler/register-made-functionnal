import {encryptUserPassword, identifyUser, register, saveUser} from "../../writes/workflows/register/register";
import {
    UnvalidatedUser,
    UserRegister
} from "../../writes/domain/register.types";
import {FakePasswordEncryptor} from "../../writes/infrastructure/fakePasswordEncryptor";
import {A} from "../builders/A";
import {MIN_PASSWORD_LENGTH} from "../../writes/workflows/register/checkPassword";
import {UserRepositoryInMemory} from "../../writes/infrastructure/userRepositoryInMemory";
import {checkError} from "../helpers/checkError";
import {
    EmailAlreadyUsed,
    InvalidEmail,
    InvalidPassword,
    InvalidUser,
    PasswordShouldContainsSpecialCharacters,
    PasswordShouldHaveAMinimumLength
} from "../../writes/domain/register.errors";
import {FakeUuidGenerator} from "../../writes/infrastructure/fakeUuidGenerator";

describe('Register a new user', function () {
    let userRepository: UserRepositoryInMemory;
    const passwordEncryptor = new FakePasswordEncryptor();

    beforeEach(() => {
        userRepository = new UserRepositoryInMemory();
    });

    test('should register a new user', async () => {
        const result = await registerUser(A.User().build());
        expect(result.isRight()).toBeTruthy();
        result.ifRight(x => expect(x).toStrictEqual(new UserRegister("f7eafd96-c194-4730-8de6-9da1c330bff3", "jane.doe@gmail.com")));
    });

    test('should persist user', async () => {
        const user = A.User().build();
        await registerUser(user);
        const persistedUser = userRepository.findByEmail(user.email);
        expect(persistedUser.email).toBe(user.email);
    });

    test('user password should be encrypted before persisted', async () => {
        const user = A.User().build();
        await registerUser(user);
        const persistedUser = userRepository.findByEmail(user.email);
        expect(persistedUser.password).toBe(user.password + FakePasswordEncryptor.ENCRYPTION_KEY);
    });

    describe('should returns an error if', function () {
        test('email is already used', async () => {
            userRepository.populate(A.User().withEmail("jane.doe@gmail.com").build());
            const result = await registerUser(A.User().withEmail("jane.doe@gmail.com").build());
            checkError(result, new EmailAlreadyUsed("jane.doe@gmail.com"));
        });
        test('the email is not valid', async () => {
            const result = await registerUser(A.User().withEmail("John").build());
            checkError(result, new InvalidUser([new InvalidEmail()]));
        });

        test('password is too small', async () => {
            const result = await registerUser(A.User().withPassword("@zert").build());
            checkError(result, new InvalidUser([new InvalidPassword([new PasswordShouldHaveAMinimumLength(MIN_PASSWORD_LENGTH)])]));
        });

        test('password has no special character', async () => {
            const result = await registerUser(A.User().withPassword("azerty").build());
            checkError(result, new InvalidUser([new InvalidPassword([new PasswordShouldContainsSpecialCharacters()])]));
        });

        test('user has an email and a password invalid', async () => {
            const result = await registerUser(A.User().withEmail("John").withPassword("azerty").build());
            checkError(result, new InvalidUser([new InvalidEmail(), new InvalidPassword([new PasswordShouldContainsSpecialCharacters()])]));
        });
    });

    function registerUser(user: UnvalidatedUser) {
        return prepareWorkflow()(user).run();
    }

    function prepareWorkflow() {
        return register(encryptUserPassword(passwordEncryptor), identifyUser(new FakeUuidGenerator()), saveUser(userRepository));
    }
});

