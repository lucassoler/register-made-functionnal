import http from "http";
import {ExpressServer} from "../../../web/expressServer";
import {Dependencies, serviceLocator} from "../../../configuration/serviceLocator";
import {UserRepositoryInMemory} from "../../writes/infrastructure/userRepositoryInMemory";
import {FakePasswordEncryptor} from "../../writes/infrastructure/fakePasswordEncryptor";

export class ExpressServerHelper {
    private readonly server: http.Server;

    constructor(public readonly serviceLocator: Dependencies) {
        this.server = new ExpressServer().create(this.serviceLocator).listen();
    }

    stop() {
        this.server.close();
    }

    get(): http.Server {
        return this.server;
    }
}