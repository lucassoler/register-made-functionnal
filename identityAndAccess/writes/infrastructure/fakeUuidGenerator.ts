import {UuidGenerator} from "../domain/ports/uuidGenerator";

export class FakeUuidGenerator implements UuidGenerator {
    nextUuidToReturn: string = "f7eafd96-c194-4730-8de6-9da1c330bff3";

    generate(): Promise<string> {
        return Promise.resolve(this.nextUuidToReturn);
    }
}