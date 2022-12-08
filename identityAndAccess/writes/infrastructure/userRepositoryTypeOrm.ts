
import { DataSource } from "typeorm";
import {UserEntity} from "../../../configuration/typeorm/entities/user";
import {UserRepository} from "../domain/ports/userRepository";
import {EitherAsync} from "purify-ts";
import {EmailAlreadyUsed} from "../domain/register.errors";
import {User} from "../domain/register.types";

export class UserRepositoryTypeOrm implements UserRepository {
    constructor(private readonly typeOrmDataSource: DataSource) {}

    persistUser(user: User): EitherAsync<EmailAlreadyUsed, User> {
        return EitherAsync(async () => {
            await this.typeOrmDataSource.createQueryBuilder()
                .insert()
                .into(UserEntity)
                .values({
                    id: user.id,
                    email: user.email,
                    password: user.password
                })
                .execute();

            return user;
        });
    }
}