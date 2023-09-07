import {UnvalidatedEmail, UnvalidatedPassword, UnvalidatedUser} from "../../writes/domain/register.types";

export class UserBuilder {
    private _password: UnvalidatedPassword = "P@ssword!1234";
    private _email: UnvalidatedEmail = "jane.doe@gmail.com";

    withPassword(password: UnvalidatedPassword): UserBuilder {
        this._password = password;
        return this;
    }

    withEmail(email: UnvalidatedEmail): UserBuilder {
        this._email = email;
        return this;
    }

    build(): UnvalidatedUser {
        return {
            email: this._email,
            password: this._password
        }
    }
}

