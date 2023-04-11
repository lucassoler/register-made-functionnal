import {UuidGenerator} from "../domain/ports/uuidGenerator";
import {randomUUID} from "crypto";
import {Task} from "fp-ts/lib/Task";
import {FromTask} from "fp-ts/Task";

export class CryptoUuidGenerator implements UuidGenerator {
    generate(): Task<string> {
        return FromTask.fromTask(() => Promise.resolve(randomUUID()));
    }
}