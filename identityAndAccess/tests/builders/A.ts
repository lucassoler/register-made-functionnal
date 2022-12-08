import {UserBuilder} from "./UserBuilder";

export class A {
    static User = (): UserBuilder => new UserBuilder()
}