import {Task} from "fp-ts/Task";

export interface UuidGenerator {
    generate(): Task<string>;
}