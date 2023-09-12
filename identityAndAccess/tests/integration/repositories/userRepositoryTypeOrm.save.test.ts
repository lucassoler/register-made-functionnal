import {DataSource} from "typeorm";
import {getDataSource} from "../../../../configuration/typeorm/connection";
import {NodeEnvironmentVariables} from "../../../../configuration/environment/environmentVariables";
import {UserEntity} from "../../../../configuration/typeorm/entities/user";
import {UserRepositoryTypeOrm} from "../../../writes/infrastructure/userRepositoryTypeOrm";
import {User} from "../../../writes/domain/register.types";
import {EmailAlreadyUsed, PersistUserError} from "../../../writes/domain/register.errors";
import * as E from "fp-ts/Either";
import {isLeft} from "fp-ts/Either";

describe('UserRepositoryTypeOrm - Save', () => {
    let repository: UserRepositoryTypeOrm;
    let dataSource: DataSource;

    const USER_TO_PERSIST = {
        id: '874a52b8-808c-4482-ad98-e99e03b7ef25',
        email: "jane.doe@gmail.com",
        password: "Password"
    };

    beforeAll(async () => {
        dataSource = await getDataSource(new NodeEnvironmentVariables()).initialize();
    });

    beforeEach(() => {
        repository = new UserRepositoryTypeOrm(dataSource);
    });

    afterEach(async () => {
        await dataSource
            .createQueryBuilder()
            .delete()
            .from(UserEntity)
            .where("id = ANY(:ids)", {ids: [USER_TO_PERSIST.id, 'ae358410-25f4-4651-b94b-2b786b358d5f', '51dc815c-4530-4562-a417-5f3aa77fa93f']})
            .execute();
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    test('should persist user in database', async () => {
        await repository.persistUser(USER_TO_PERSIST)();
        const persistedUser = await retrievePersistedUser(dataSource, USER_TO_PERSIST.id);
        verifyPersistedUser(persistedUser, USER_TO_PERSIST);
    });

    test('should return an email already used error if user already persisted', async () => {
        await repository.persistUser({
            id: 'ae358410-25f4-4651-b94b-2b786b358d5f',
            email: "jane.doe@gmail.com",
            password: "Password"
        })();
        const result = await repository.persistUser(USER_TO_PERSIST)();
        expect(isLeft(result)).toBeTruthy();
        expect(result).toEqual(E.left(new EmailAlreadyUsed('jane.doe@gmail.com')));
    });


    test('uncaught error : id already used', async () => {
        await repository.persistUser({
            id: '51dc815c-4530-4562-a417-5f3aa77fa93f',
            email: "jane.doe@gmail.com",
            password: "Password"
        })();
        const result = await repository.persistUser({
            id: '51dc815c-4530-4562-a417-5f3aa77fa93f',
            email: "jane.doe@gmail.com",
            password: "Password"
        })();
        expect(isLeft(result)).toBeTruthy();
        expect(result).toEqual(E.left(new PersistUserError()));
    });

});

function verifyPersistedUser(persistedUser: UserEntity | null, user: User) {
    expect(persistedUser).not.toBeNull();
    expect(persistedUser!.id).toStrictEqual(user.id);
    expect(persistedUser!.email).toStrictEqual(user.email);
    expect(persistedUser!.password).toStrictEqual(user.password);
}

const retrievePersistedUser = async (dataSource: DataSource, userId: string) =>
    await dataSource
        .getRepository(UserEntity)
        .createQueryBuilder("user")
        .where("user.id = :id", {id: userId})
        .getOne()