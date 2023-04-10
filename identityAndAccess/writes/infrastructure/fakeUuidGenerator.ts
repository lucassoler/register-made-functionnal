import { UuidGenerator } from "../domain/ports/uuidGenerator";
import {FromTask, Task} from "fp-ts/lib/Task";

export class FakeUuidGenerator implements UuidGenerator {
    nextUuidToReturn: string = "f7eafd96-c194-4730-8de6-9da1c330bff3";

    generate(): Task<string> {
        return FromTask.fromTask(() => Promise.resolve(this.nextUuidToReturn));
    }
}