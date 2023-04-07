import { DataSource } from "typeorm";
import {getDataSource} from "../../../../configuration/typeorm/connection";
import {NodeEnvironmentVariables} from "../../../../configuration/environment/environmentVariables";
import {UserEntity} from "../../../../configuration/typeorm/entities/user";
import {UserRepositoryTypeOrm} from "../../../writes/infrastructure/userRepositoryTypeOrm";
import {FakeUuidGenerator} from "../../../writes/infrastructure/fakeUuidGenerator";
import {User} from "../../../writes/domain/register.types";
import {EmailAlreadyUsed, PersistUserError} from "../../../writes/domain/register.errors";
describe('UserRepositoryTypeOrm - Save', () => {
    let repository: UserRepositoryTypeOrm;
    let fakeUuidGenerator: FakeUuidGenerator;
    let dataSource: DataSource;

    const USER_TO_PERSIST = {
        id: 'f7eafd96-c194-4730-8de6-9da1c330bff3',
        email: "jane.doe@gmail.com",
        password: "Password"
    };

    beforeAll(async () => {
        dataSource = await getDataSource(new NodeEnvironmentVariables()).initialize();

    });

    beforeEach(() => {
        fakeUuidGenerator = new FakeUuidGenerator();
        repository = new UserRepositoryTypeOrm(dataSource);
    });

    afterEach(async () => {
        await dataSource
            .createQueryBuilder()
            .delete()
            .from(UserEntity)
            .where("id = ANY(:ids)", {ids: [USER_TO_PERSIST.id, 'ae358410-25f4-4651-b94b-2b786b358d5f']})
            .execute();
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    test('should persist user in database', async () => {
        await repository.persistUser(USER_TO_PERSIST);
        const persistedUser = await retrievePersistedUser(dataSource, USER_TO_PERSIST.id);
        verifyPersistedUser(persistedUser, USER_TO_PERSIST);
    });

    test('should return an email already used error if user already persisted', async () => {
        await repository.persistUser({
            id: 'ae358410-25f4-4651-b94b-2b786b358d5f',
            email: "jane.doe@gmail.com",
            password: "Password"
        });
        const result = await repository.persistUser(USER_TO_PERSIST);
        expect(result.isLeft()).toBeTruthy();
        result.mapLeft(error => expect(error).toStrictEqual(new EmailAlreadyUsed('jane.doe@gmail.com')));
    });


    test('uncaught error : id already used', async () => {
        await repository.persistUser(USER_TO_PERSIST);
        const result = await repository.persistUser(USER_TO_PERSIST);
        expect(result.isLeft()).toBeTruthy();
        result.mapLeft(error => expect(error).toStrictEqual(new PersistUserError()));
    });

});

function verifyPersistedUser(persistedUser: UserEntity | null, user: User) {
    expect(persistedUser).not.toBeNull();
    expect(persistedUser!.id).toStrictEqual(user.id);
    expect(persistedUser!.email).toStrictEqual(user.email);
    expect(persistedUser!.password).toStrictEqual(user.password);
}

async function retrievePersistedUser(dataSource: DataSource, userId: string) {
    return await dataSource.getRepository(UserEntity).createQueryBuilder("user").where("user.id = :id", { id: userId }).getOne();
}