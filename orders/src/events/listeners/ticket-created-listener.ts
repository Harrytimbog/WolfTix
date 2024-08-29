import { JsMsg } from "nats";
import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from "@clonedwolftickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly queueGroupName: string = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: JsMsg) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
    // Acknowledge the message to be successfully processed
    msg.ack();
  }
}
