import {DomainEvent} from "../../../sharedKernel/domain/domainEvent";

export class WelcomeEmailSent extends DomainEvent {
    constructor() {
        super();
    }
}