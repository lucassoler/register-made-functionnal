import {DataSource} from "typeorm";
import {getDataSource} from "../../../../configuration/typeorm/connection";
import {NodeEnvironmentVariables} from "../../../../configuration/environment/environmentVariables";
import {UserEntity} from "../../../../configuration/typeorm/entities/user";
import {UserRepositoryTypeOrm} from "../../../writes/infrastructure/userRepositoryTypeOrm";
import {isNone, some} from "fp-ts/Option";

describe('UserRepositoryTypeOrm - Find by email', () => {
    let repository: UserRepositoryTypeOrm;
    let dataSource: DataSource;

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
            .where("id = ANY(:ids)", {ids: ['91b5da15-2b82-434e-b626-c3fb78cfeafc']})
            .execute();
    });

    afterAll(async () => {
        await dataSource.destroy();
    });

    test('should find user by email', async () => {
        await repository.persistUser({
            id: '91b5da15-2b82-434e-b626-c3fb78cfeafc',
            email: "jane.doe+find-by-email@gmail.com",
            password: "Password"
        })();

        const result = await repository.findByEmail("jane.doe+find-by-email@gmail.com")();

        expect(result).toEqual(some({
            id: '91b5da15-2b82-434e-b626-c3fb78cfeafc',
            email: "jane.doe+find-by-email@gmail.com",
            password: "Password"
        }));
    });

    test('should not find user by email', async () => {
        const user = await repository.findByEmail("joe.doe@gmail.com")();

        expect(isNone(user)).toBeTruthy();
    });
});