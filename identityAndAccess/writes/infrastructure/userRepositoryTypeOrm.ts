import {DataSource, QueryFailedError} from "typeorm";
import {UserEntity} from "../../../configuration/typeorm/entities/user";
import {UserRepository} from "../domain/ports/userRepository";
import {EmailAlreadyUsed, PersistUserError} from "../domain/register.errors";
import {Email, User} from "../domain/register.types";
import {pipe} from "fp-ts/function";
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';

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

    findByEmail(email: Email): TO.TaskOption<User> {
        return pipe(
            this.typeOrmDataSource.getRepository(UserEntity)
                .createQueryBuilder("user").where('user.email = :email', {email}),
            (qb) => TO.tryCatch(() => qb.getOneOrFail()),
            TO.map((userEntity) => ({
                id: userEntity.id,
                email: userEntity.email,
                password: userEntity.password
            }))
        );
    }
}