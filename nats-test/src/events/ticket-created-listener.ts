import { JsMsg } from "nats";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "orders-service-queue-group";

  onMessage(data: TicketCreatedEvent["data"], msg: JsMsg) {
    console.log(`Received event with data: ${JSON.stringify(data)}`);
    msg.ack();
  }
}
