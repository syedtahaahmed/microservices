import { Message } from 'node-nats-streaming';
import { Listner } from './base-listner'
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';
export class TicketCreatedListner extends Listner<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = "payments-service";
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log("Event data", data);
        console.log(data.id);
        console.log(data.price);
        console.log(data.title);
        msg.ack();
    }
}