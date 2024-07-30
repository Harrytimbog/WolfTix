import { JsMsg } from "nats";
import { Listener } from "../../../common/src/events/base-listener";
import { TicketCreatedEvent } from "../../../common/src/events/ticket-created-event";
import { Subjects } from "../../../common/src/events/subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "orders-service-queue-group";

  onMessage(data: TicketCreatedEvent["data"], msg: JsMsg) {
    console.log(`Received event with data: ${JSON.stringify(data)}`);
    msg.ack();
  }
}
