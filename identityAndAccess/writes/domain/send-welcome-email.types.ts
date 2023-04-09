import {DomainEvent} from "../../../sharedKernel/domain/domainEvent";

export class SendWelcomeEmailTypes extends DomainEvent {
    constructor() {
        super();
    }
}