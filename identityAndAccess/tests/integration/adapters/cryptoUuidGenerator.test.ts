import {Just} from "purify-ts";
import {CryptoUuidGenerator} from "../../../writes/infrastructure/cryptoUuidGenerator";

describe('crypto uuid generator', () => {
   test('should generate an uuid', () => {
        const uuidGenerator = new CryptoUuidGenerator();
        const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
        expect(uuidGenerator.generate()).resolves.toEqual(Just(expect.stringMatching(regex)))
   });
});

