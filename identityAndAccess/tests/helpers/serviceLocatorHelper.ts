import {Dependencies, serviceLocator} from "../../../configuration/serviceLocator";
import {UserRepositoryInMemory} from "../../writes/infrastructure/userRepositoryInMemory";

export class ServiceLocatorHelper {
    readonly serviceLocator: Dependencies;
    readonly userRepository: UserRepositoryInMemory;
    constructor() {
        this.userRepository = new UserRepositoryInMemory();
        this.serviceLocator = serviceLocator();
        this.serviceLocator.userRepository = this.userRepository;
    }
}