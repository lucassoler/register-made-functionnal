import {CryptoUuidGenerator} from "../../../writes/infrastructure/cryptoUuidGenerator";

describe('crypto uuid generator', () => {
    test('should generate an uuid', async () => {
        const uuidGenerator = new CryptoUuidGenerator();
        const regex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
        const result = await uuidGenerator.generate()();
        expect(result).toEqual(expect.stringMatching(regex));
    });
});

