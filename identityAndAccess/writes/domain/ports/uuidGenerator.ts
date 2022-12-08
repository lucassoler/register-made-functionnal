import {Maybe} from "purify-ts";

export interface UuidGenerator {
    generate(): Promise<string>;
}