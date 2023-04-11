import {DataSource, QueryFailedError} from "typeorm";
import {UserEntity} from "../../../configuration/typeorm/entities/user";
import {UserRepository} from "../domain/ports/userRepository";
import {EitherAsync} from "purify-ts";
import {EmailAlreadyUsed, PersistUserError} from "../domain/register.errors";
import {User} from "../domain/register.types";
import {pipe} from "fp-ts/function";
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'typeorm';

export class UserRepositoryTypeOrm implements UserRepository {
    constructor(private readonly typeOrmDataSource: DataSource) {
    }

    persistUser(user: User): TE.TaskEither<EmailAlreadyUsed, User> {
        return pipe(
            user,
            (u) =>
                this.typeOrmDataSource.createQueryBuilder().insert().into(UserEntity).values({
                    id: u.id,
                    email: u.email,
                    password: u.password
                }),
            (qb) => TE.tryCatch(() => qb.execute(), E.toError),
            TE.mapLeft((error) =>
                error instanceof QueryFailedError && error.driverError.code === '23505' && error.driverError.constraint === 'email_unique_index'
                    ? new EmailAlreadyUsed(user.email)
                    : new PersistUserError()
            ),
            TE.map(() => user)
        );
    }
}