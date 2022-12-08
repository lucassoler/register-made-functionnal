import { DataSource } from "typeorm";
import {getDataSource} from "../../../../configuration/typeorm/connection";
import {NodeEnvironmentVariables} from "../../../../configuration/environment/environmentVariables";
import {UserEntity} from "../../../../configuration/typeorm/entities/user";
import {UserRepositoryTypeOrm} from "../../../writes/infrastructure/userRepositoryTypeOrm";
import {FakeUuidGenerator} from "../../../writes/infrastructure/fakeUuidGenerator";
import {EncryptedUser, User} from "../../../writes/domain/register.types";
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
        repository = new UserRepositoryTypeOrm(fakeUuidGenerator, dataSource);
    });

    afterAll(async () => {
        await dataSource
            .createQueryBuilder()
            .delete()
            .from(UserEntity)
            .where("id = :id", { id: USER_TO_PERSIST.id })
            .execute();


        await dataSource.destroy();
    });

    test('should persist user in database', async () => {
        await repository.persistUser(USER_TO_PERSIST);
        const persistedUser = await retrievePersistedUser(dataSource, USER_TO_PERSIST.id);
        verifyPersistedUser(persistedUser, USER_TO_PERSIST);
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