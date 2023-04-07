import {UuidGenerator} from "../domain/ports/uuidGenerator";
import {Just, MaybeAsync} from "purify-ts";
import {randomUUID} from "crypto";

export class CryptoUuidGenerator implements UuidGenerator {
    generate(): MaybeAsync<string> {
        return MaybeAsync.liftMaybe(Just(randomUUID()));
    }
}