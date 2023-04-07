import {MaybeAsync} from "purify-ts";

export interface UuidGenerator {
    generate(): MaybeAsync<string>;
}