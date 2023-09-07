import {Email, Password, UnvalidatedEmail, UnvalidatedPassword, User, UserId} from "../../writes/domain/register.types";

export class ExistingUserBuilder {
    private _password: Password = "P@ssword!1234";
    private _email: Email = "jane.doe@gmail.com";
    private _id: UserId = "1234";

    withPassword(password: UnvalidatedPassword): ExistingUserBuilder {
        this._password = password;
        return this;
    }

    withEmail(email: UnvalidatedEmail): ExistingUserBuilder {
        this._email = email;
        return this;
    }

    build(): User {
        return {
            id: this._id,
            email: this._email,
            password: this._password
        }
    }
}