
import {DataSource, QueryFailedError} from "typeorm";
import {UserEntity} from "../../../configuration/typeorm/entities/user";
import {UserRepository} from "../domain/ports/userRepository";
import {EitherAsync} from "purify-ts";
import {EmailAlreadyUsed, PersistUserError} from "../domain/register.errors";
import {User} from "../domain/register.types";

export class UserRepositoryTypeOrm implements UserRepository {
    constructor(private readonly typeOrmDataSource: DataSource) {}

    persistUser(user: User): EitherAsync<EmailAlreadyUsed, User> {
        return EitherAsync(async () => {
            try {
                await this.typeOrmDataSource.createQueryBuilder()
                    .insert()
                    .into(UserEntity)
                    .values({
                        id: user.id,
                        email: user.email,
                        password: user.password
                    })
                    .execute();
            } catch(error) {
                if (error instanceof QueryFailedError && error.driverError.code === '23505' && error.driverError.constraint === "email_unique_index") {
                    throw new EmailAlreadyUsed(user.email);
                }

                throw new PersistUserError();
            }

            return user;
        });
    }
}