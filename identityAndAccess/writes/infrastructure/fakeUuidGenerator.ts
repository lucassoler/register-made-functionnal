import {UuidGenerator} from "../domain/ports/uuidGenerator";
import {Just, MaybeAsync} from "purify-ts";

export class FakeUuidGenerator implements UuidGenerator {
    nextUuidToReturn: string = "f7eafd96-c194-4730-8de6-9da1c330bff3";

    generate(): MaybeAsync<string> {
        return MaybeAsync.liftMaybe(Just(this.nextUuidToReturn));
    }
}