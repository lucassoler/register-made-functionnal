import {ExistingUserBuilder} from "./ExistingUserBuilder";

export class An {
    static ExistingUser = (): ExistingUserBuilder => new ExistingUserBuilder()
}